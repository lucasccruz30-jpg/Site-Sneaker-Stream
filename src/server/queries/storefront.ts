import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import type {
  BannerData,
  CatalogFiltersData,
  CatalogPageData,
  CatalogSearchInput,
  HomePageData,
  OrderSummaryData,
  ProductCardData,
  ProductDetailData,
  SiteSettingsData,
} from "@/types";

const productCardInclude = {
  brand: true,
  category: true,
  images: {
    orderBy: {
      sortOrder: "asc",
    },
    take: 1,
  },
  variants: {
    include: {
      size: true,
    },
  },
} satisfies Prisma.ProductInclude;

type ProductCardRecord = Prisma.ProductGetPayload<{
  include: typeof productCardInclude;
}>;

function coerceStringArray(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function coerceSpecs(value: Prisma.JsonValue | null | undefined) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (typeof item === "object" && item && "label" in item && "value" in item) {
        return {
          label: String(item.label),
          value: String(item.value),
        };
      }

      return null;
    })
    .filter(Boolean) as Array<{ label: string; value: string }>;
}

function coerceRecord(value: Prisma.JsonValue | null | undefined) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return {};
  }

  return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, String(item)]));
}

function mapProductCard(product: ProductCardRecord): ProductCardData {
  const totalStock = product.variants.reduce((acc, variant) => acc + Math.max(variant.stock - variant.reservedStock, 0), 0);

  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    brand: product.brand.name,
    category: product.category.name,
    shortDescription: product.shortDescription,
    colorway: product.colorway,
    basePriceInCents: product.basePriceInCents,
    salePriceInCents: product.salePriceInCents,
    ratingAverage: Number(product.ratingAverage),
    reviewCount: product.reviewCount,
    totalStock,
    sizes: product.variants.map((variant) => variant.size.label),
    image: product.images[0]?.url ?? "/images/placeholder-product.jpg",
    isFeatured: product.isFeatured,
    isExclusive: product.isExclusive,
    isNewRelease: product.isNewRelease,
    isOnSale: product.isOnSale,
  };
}

const fallbackSettings: SiteSettingsData = {
  storeName: siteConfig.name,
  tagline: "A sua loja de tênis premium e importados",
  supportEmail: "contato@sneakerstream.com.br",
  supportPhone: "+55 11 99999-9999",
  whatsapp: "+55 11 99999-9999",
  logoUrl: "/brand/logo-primary.png",
  faviconUrl: "/brand/favicon.png",
  primaryColor: siteConfig.colors.charcoal,
  accentColor: siteConfig.colors.wine,
  highlightColor: siteConfig.colors.black,
  offWhiteColor: siteConfig.colors.offWhite,
  metaTitle: siteConfig.title,
  metaDescription: siteConfig.description,
  shippingLeadText: "Despacho rápido com rastreio seguro para todo o Brasil.",
  announcementText: "Frete especial em pedidos selecionados e 5% OFF no PIX.",
  instagramUrl: "https://instagram.com/sneakerstream",
  tiktokUrl: "https://tiktok.com/@sneakerstream",
  freeShippingThresholdCents: 199900,
  pixDiscountPercentage: 5,
  authenticityMessage: "Todos os pares passam por conferência interna de autenticidade antes do envio.",
};

export async function getSiteSettings() {
  const settings = await prisma.settings.findUnique({
    where: { id: "store" },
  });

  if (!settings) {
    return fallbackSettings;
  }

  return settings satisfies SiteSettingsData;
}

export async function getActiveBanners(placement?: BannerData["placement"]) {
  const banners = await prisma.banner.findMany({
    where: {
      isActive: true,
      ...(placement ? { placement } : {}),
    },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
  });

  return banners satisfies BannerData[];
}

export async function getHomePageData(): Promise<HomePageData> {
  const [heroBanners, launchProducts, bestSellers, offers, featuredBrands, featuredCategories, weekHighlights, exclusiveProducts, testimonialProducts, settings] =
    await Promise.all([
      getActiveBanners("HERO"),
      prisma.product.findMany({
        where: { isActive: true, isNewRelease: true },
        include: productCardInclude,
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: productCardInclude,
        take: 8,
        orderBy: [{ reviewCount: "desc" }, { createdAt: "desc" }],
      }),
      prisma.product.findMany({
        where: { isActive: true, isOnSale: true },
        include: productCardInclude,
        take: 8,
        orderBy: { createdAt: "desc" },
      }),
      prisma.brand.findMany({
        where: { isActive: true, isFeatured: true },
        take: 5,
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true, isFeatured: true },
        take: 6,
        orderBy: { name: "asc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        include: productCardInclude,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isExclusive: true },
        include: productCardInclude,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        include: productCardInclude,
        take: 3,
        orderBy: { reviewCount: "desc" },
      }),
      getSiteSettings(),
    ]);

  return {
    heroBanners,
    launchProducts: launchProducts.map(mapProductCard),
    bestSellers: bestSellers.map(mapProductCard),
    offers: offers.map(mapProductCard),
    featuredBrands,
    featuredCategories,
    weekHighlights: weekHighlights.map(mapProductCard),
    exclusiveProducts: exclusiveProducts.map(mapProductCard),
    testimonialProducts: testimonialProducts.map(mapProductCard),
    settings,
  };
}

export async function getCatalogFilters(): Promise<CatalogFiltersData> {
  const [brands, categories, sizes, prices] = await Promise.all([
    prisma.brand.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.category.findMany({
      where: { isActive: true },
      select: { id: true, name: true, slug: true },
      orderBy: { name: "asc" },
    }),
    prisma.size.findMany({
      select: { id: true, label: true },
      orderBy: { sortOrder: "asc" },
    }),
    prisma.product.findMany({
      where: { isActive: true },
      select: { basePriceInCents: true, salePriceInCents: true },
    }),
  ]);

  const normalizedPrices = prices.map((product) => product.salePriceInCents ?? product.basePriceInCents);

  return {
    brands,
    categories,
    sizes,
    minPriceInCents: normalizedPrices.length ? Math.min(...normalizedPrices) : 0,
    maxPriceInCents: normalizedPrices.length ? Math.max(...normalizedPrices) : 0,
  };
}

function buildCatalogWhere(searchParams: CatalogSearchInput): Prisma.ProductWhereInput {
  const andFilters: Prisma.ProductWhereInput[] = [];

  if (searchParams.search) {
    andFilters.push({
      OR: [
        { name: { contains: searchParams.search, mode: "insensitive" } },
        { shortDescription: { contains: searchParams.search, mode: "insensitive" } },
        { colorway: { contains: searchParams.search, mode: "insensitive" } },
        { brand: { is: { name: { contains: searchParams.search, mode: "insensitive" } } } },
      ],
    });
  }

  if (searchParams.brand) {
    andFilters.push({
      brand: {
        is: {
          slug: searchParams.brand,
        },
      },
    });
  }

  if (searchParams.category) {
    andFilters.push({
      category: {
        is: {
          slug: searchParams.category,
        },
      },
    });
  }

  if (searchParams.size) {
    andFilters.push({
      variants: {
        some: {
          stock: { gt: 0 },
          size: {
            label: searchParams.size,
          },
        },
      },
    });
  }

  if (searchParams.color) {
    andFilters.push({
      colorway: {
        contains: searchParams.color,
        mode: "insensitive",
      },
    });
  }

  if (searchParams.availability === "in-stock") {
    andFilters.push({
      variants: {
        some: {
          stock: {
            gt: 0,
          },
        },
      },
    });
  }

  if (searchParams.highlight === "new") {
    andFilters.push({ isNewRelease: true });
  }

  if (searchParams.highlight === "sale") {
    andFilters.push({ isOnSale: true });
  }

  if (searchParams.highlight === "exclusive") {
    andFilters.push({ isExclusive: true });
  }

  const minPrice = Math.round(Number(searchParams.minPrice) * 100);
  const maxPrice = Math.round(Number(searchParams.maxPrice) * 100);

  if (!Number.isNaN(minPrice) && minPrice > 0) {
    andFilters.push({
      OR: [
        { salePriceInCents: { gte: minPrice } },
        { salePriceInCents: null, basePriceInCents: { gte: minPrice } },
      ],
    });
  }

  if (!Number.isNaN(maxPrice) && maxPrice > 0) {
    andFilters.push({
      OR: [
        { salePriceInCents: { lte: maxPrice } },
        { salePriceInCents: null, basePriceInCents: { lte: maxPrice } },
      ],
    });
  }

  return {
    isActive: true,
    AND: andFilters,
  };
}

function buildCatalogOrderBy(sort?: string): Prisma.ProductOrderByWithRelationInput[] {
  switch (sort) {
    case "price-asc":
      return [{ basePriceInCents: "asc" }];
    case "price-desc":
      return [{ basePriceInCents: "desc" }];
    case "bestsellers":
      return [{ reviewCount: "desc" }, { createdAt: "desc" }];
    case "newest":
      return [{ createdAt: "desc" }];
    default:
      return [{ isFeatured: "desc" }, { createdAt: "desc" }];
  }
}

export async function getCatalogPageData(searchParams: CatalogSearchInput): Promise<CatalogPageData> {
  const page = Math.max(Number(searchParams.page ?? "1") || 1, 1);
  const pageSize = 12;
  const where = buildCatalogWhere(searchParams);

  const [filters, total, products] = await Promise.all([
    getCatalogFilters(),
    prisma.product.count({ where }),
    prisma.product.findMany({
      where,
      include: productCardInclude,
      orderBy: buildCatalogOrderBy(searchParams.sort),
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
  ]);

  return {
    products: products.map(mapProductCard),
    total,
    page,
    pageSize,
    filters,
  };
}

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      brand: true,
      category: true,
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
      reviews: {
        where: {
          status: "APPROVED",
        },
        include: {
          user: {
            select: {
              name: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!product || !product.isActive) {
    return null;
  }

  const related = await prisma.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      OR: [{ brandId: product.brandId }, { categoryId: product.categoryId }],
    },
    include: productCardInclude,
    take: 4,
    orderBy: { createdAt: "desc" },
  });

  return {
    ...mapProductCard(product),
    description: product.description,
    metaTitle: product.metaTitle,
    metaDescription: product.metaDescription,
    installmentCount: product.installmentCount,
    leadTimeInBusinessDays: product.leadTimeInBusinessDays,
    highlights: coerceStringArray(product.highlights),
    specs: coerceSpecs(product.specs),
    details: coerceRecord(product.details),
    gallery: product.images.map((image) => ({
      id: image.id,
      url: image.url,
      alt: image.alt,
      isPrimary: image.isPrimary,
    })),
    variants: product.variants.map((variant) => ({
      id: variant.id,
      sizeId: variant.sizeId,
      sizeLabel: variant.size.label,
      stock: Math.max(variant.stock - variant.reservedStock, 0),
    })),
    reviews: product.reviews.map((review) => ({
      id: review.id,
      userName: review.user.name,
      rating: review.rating,
      title: review.title,
      comment: review.comment,
      verifiedPurchase: review.verifiedPurchase,
      createdAt: review.createdAt,
      status: review.status,
    })),
    relatedProducts: related.map(mapProductCard),
  };
}

export async function getProductsByIds(productIds: string[]) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    include: productCardInclude,
  });

  return products.map(mapProductCard);
}

export async function getSearchSuggestions(query: string) {
  if (!query.trim()) {
    return [];
  }

  const products = await prisma.product.findMany({
    where: {
      isActive: true,
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { shortDescription: { contains: query, mode: "insensitive" } },
        { brand: { name: { contains: query, mode: "insensitive" } } },
      ],
    },
    include: productCardInclude,
    take: 6,
    orderBy: { createdAt: "desc" },
  });

  return products.map(mapProductCard);
}

export async function getContentPage(slug: string) {
  return prisma.contentPage.findUnique({
    where: { slug },
  });
}

export async function getUserOrders(userId: string): Promise<OrderSummaryData[]> {
  const orders = await prisma.order.findMany({
    where: { userId },
    include: {
      items: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return orders.map((order) => ({
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
}

export async function getUserAccountSummary(userId: string) {
  const [user, orders] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      include: {
        addresses: {
          orderBy: [{ isDefaultShipping: "desc" }, { createdAt: "asc" }],
        },
      },
    }),
    getUserOrders(userId),
  ]);

  return {
    user,
    orders,
  };
}
