import { formatCurrency } from "@/lib/format";
import { prisma } from "@/lib/prisma";
import type { AdminDashboardData, CouponData, OrderSummaryData } from "@/types";

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const [orders, products, users, revenueAgg, lowStockProducts, recentCustomers] = await Promise.all([
    prisma.order.findMany({
      include: {
        items: true,
      },
      orderBy: { createdAt: "desc" },
      take: 8,
    }),
    prisma.product.findMany({
      include: {
        brand: true,
        variants: true,
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
    prisma.order.aggregate({
      _sum: {
        totalCents: true,
      },
      _avg: {
        totalCents: true,
      },
      _count: {
        id: true,
      },
      where: {
        status: {
          not: "CANCELLED",
        },
      },
    }),
    prisma.product.findMany({
      include: {
        brand: true,
        variants: true,
      },
      take: 6,
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
    }),
  ]);

  const paidOrders = orders.filter((order) => order.status !== "CANCELLED");
  const totalRevenueCents = revenueAgg._sum.totalCents ?? 0;
  const averageTicketCents = Math.round(revenueAgg._avg.totalCents ?? 0);
  const topProductsMap = new Map<string, { id: string; name: string; quantity: number; revenueCents: number }>();

  for (const order of paidOrders) {
    for (const item of order.items) {
      const current = topProductsMap.get(item.productId) ?? {
        id: item.productId,
        name: item.productName,
        quantity: 0,
        revenueCents: 0,
      };

      current.quantity += item.quantity;
      current.revenueCents += item.lineTotalCents;
      topProductsMap.set(item.productId, current);
    }
  }

  const topProducts = [...topProductsMap.values()]
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 5);

  const recentOrders: OrderSummaryData[] = orders.map((order) => ({
    id: order.id,
    orderNumber: order.orderNumber,
    status: order.status,
    paymentStatus: order.paymentStatus,
    paymentMethod: order.paymentMethod,
    totalCents: order.totalCents,
    placedAt: order.placedAt,
    trackingCode: order.trackingCode,
    items: order.items.map((item) => ({
      id: item.id,
      productName: item.productName,
      productSlug: item.productSlug,
      imageUrl: item.imageUrl,
      quantity: item.quantity,
      sizeLabel: item.sizeLabel,
      lineTotalCents: item.lineTotalCents,
    })),
  }));

  const lowStockNormalized = lowStockProducts
    .map((product) => ({
      id: product.id,
      slug: product.slug,
      name: product.name,
      brand: product.brand.name,
      stock: product.variants.reduce((acc, variant) => acc + Math.max(variant.stock - variant.reservedStock, 0), 0),
    }))
    .filter((product) => product.stock > 0 && product.stock <= 6)
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 6);

  const revenueByMonthMap = new Map<string, number>();
  for (const order of paidOrders) {
    const label = new Intl.DateTimeFormat("pt-BR", { month: "short", year: "2-digit" }).format(order.createdAt);
    revenueByMonthMap.set(label, (revenueByMonthMap.get(label) ?? 0) + order.totalCents);
  }

  return {
    metrics: [
      {
        label: "Vendas totais",
        value: formatCurrency(totalRevenueCents),
        hint: `${revenueAgg._count.id ?? 0} pedidos`,
      },
      {
        label: "Ticket médio",
        value: formatCurrency(averageTicketCents),
        hint: "Baseado em pedidos pagos",
      },
      {
        label: "Produtos ativos",
        value: String(products.filter((product) => product.isActive).length),
        hint: `${products.filter((product) => product.isFeatured).length} em destaque`,
      },
      {
        label: "Clientes",
        value: String(users.filter((user) => user.role === "CUSTOMER").length),
        hint: "Base cadastrada",
      },
    ],
    recentOrders,
    lowStockProducts: lowStockNormalized,
    topProducts,
    recentCustomers: recentCustomers.map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      role: user.role,
    })),
    revenueByMonth: [...revenueByMonthMap.entries()].map(([label, totalCents]) => ({ label, totalCents })),
  };
}

export async function getAdminProducts() {
  return prisma.product.findMany({
    include: {
      brand: true,
      category: true,
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1,
      },
      variants: {
        include: {
          size: true,
        },
        orderBy: {
          size: {
            sortOrder: "asc",
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminProduct(productId: string) {
  return prisma.product.findUnique({
    where: { id: productId },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
      variants: {
        include: {
          size: true,
        },
        orderBy: {
          size: {
            sortOrder: "asc",
          },
        },
      },
    },
  });
}

export async function getAdminCatalogLookups() {
  const [brands, categories, sizes] = await Promise.all([
    prisma.brand.findMany({ orderBy: { name: "asc" } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
    prisma.size.findMany({ orderBy: { sortOrder: "asc" } }),
  ]);

  return { brands, categories, sizes };
}

export async function getAdminCategories() {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getAdminBrands() {
  return prisma.brand.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: { products: true },
      },
    },
  });
}

export async function getAdminInventory() {
  return prisma.productVariant.findMany({
    include: {
      product: {
        include: {
          brand: true,
        },
      },
      size: true,
    },
    orderBy: [{ stock: "asc" }, { updatedAt: "desc" }],
  });
}

export async function getAdminOrders() {
  return prisma.order.findMany({
    include: {
      user: true,
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCustomers() {
  return prisma.user.findMany({
    where: { role: { in: ["CUSTOMER", "ADMIN", "STAFF"] } },
    include: {
      _count: {
        select: { orders: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminCoupons(): Promise<CouponData[]> {
  return prisma.coupon.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminBanners() {
  return prisma.banner.findMany({
    orderBy: [{ placement: "asc" }, { sortOrder: "asc" }],
  });
}

export async function getAdminReviews() {
  return prisma.review.findMany({
    include: {
      product: true,
      user: true,
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getAdminContentPages() {
  return prisma.contentPage.findMany({
    orderBy: { slug: "asc" },
  });
}

export async function getAdminReports() {
  const orders = await prisma.order.findMany({
    include: { items: true },
    where: {
      status: {
        not: "CANCELLED",
      },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalItemsSold = orders.reduce(
    (sum, order) => sum + order.items.reduce((itemsSum, item) => itemsSum + item.quantity, 0),
    0,
  );

  const paymentMethodBreakdown = orders.reduce<Record<string, number>>((acc, order) => {
    acc[order.paymentMethod] = (acc[order.paymentMethod] ?? 0) + 1;
    return acc;
  }, {});

  return {
    totalOrders: orders.length,
    totalItemsSold,
    paymentMethodBreakdown,
    revenueCents: orders.reduce((sum, order) => sum + order.totalCents, 0),
  };
}

export async function getAdminSettings() {
  return prisma.settings.findUnique({
    where: { id: "store" },
  });
}
