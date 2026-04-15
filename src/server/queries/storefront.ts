import { unstable_cache } from "next/cache";
import { Prisma } from "@prisma/client";

import { storefrontCache } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/lib/site";
import type {
  BannerData,
  CatalogFiltersData,
  CatalogPageData,
  CatalogSearchInput,
  DropsPageData,
  HomePageData,
  OrderSummaryData,
  ProductCardData,
  ProductDetailData,
  ShopDiscoveryData,
  SiteSettingsData,
} from "@/types";

const productCardSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  colorway: true,
  basePriceInCents: true,
  salePriceInCents: true,
  ratingAverage: true,
  reviewCount: true,
  isFeatured: true,
  isExclusive: true,
  isNewRelease: true,
  isOnSale: true,
  brand: {
    select: {
      name: true,
    },
  },
  category: {
    select: {
      name: true,
    },
  },
  images: {
    select: {
      url: true,
    },
    orderBy: {
      sortOrder: "asc",
    },
    take: 1,
  },
  variants: {
    orderBy: {
      size: {
        sortOrder: "asc",
      },
    },
    select: {
      stock: true,
      reservedStock: true,
      size: {
        select: {
          label: true,
        },
      },
    },
  },
} satisfies Prisma.ProductSelect;

type ProductCardRecord = Prisma.ProductGetPayload<{
  select: typeof productCardSelect;
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
  tagline: "A sua loja de tenis premium e importados",
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
  shippingLeadText: "Despacho rapido com rastreio seguro para todo o Brasil.",
  announcementText: "Frete especial em pedidos selecionados e 5% OFF no PIX.",
  instagramUrl: "https://instagram.com/sneakerstream",
  tiktokUrl: "https://tiktok.com/@sneakerstream",
  freeShippingThresholdCents: 199900,
  pixDiscountPercentage: 5,
  authenticityMessage: "Todos os pares passam por conferencia interna de autenticidade antes do envio.",
};

const getCachedSiteSettings = unstable_cache(
  async (): Promise<SiteSettingsData> => {
    const settings = await prisma.settings.findUnique({
      where: { id: "store" },
    });

    if (!settings) {
      return fallbackSettings;
    }

    return settings satisfies SiteSettingsData;
  },
  ["site-settings"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.settings],
  },
);

export async function getSiteSettings() {
  return getCachedSiteSettings();
}

const getCachedActiveBanners = unstable_cache(
  async (placement?: BannerData["placement"]): Promise<BannerData[]> => {
    const banners = await prisma.banner.findMany({
      where: {
        isActive: true,
        ...(placement ? { placement } : {}),
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    });

    return banners satisfies BannerData[];
  },
  ["active-banners"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.banners],
  },
);

export async function getActiveBanners(placement?: BannerData["placement"]) {
  return getCachedActiveBanners(placement);
}

const getCachedHomePageData = unstable_cache(
  async (): Promise<HomePageData> => {
    const [heroBanners, launchProducts, bestSellers, weekHighlights, exclusiveProducts, settings] = await Promise.all([
      getActiveBanners("HERO"),
      prisma.product.findMany({
        where: { isActive: true, isNewRelease: true },
        select: productCardSelect,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true },
        select: productCardSelect,
        take: 3,
        orderBy: [{ reviewCount: "desc" }, { createdAt: "desc" }],
      }),
      prisma.product.findMany({
        where: { isActive: true, isFeatured: true },
        select: productCardSelect,
        take: 1,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isExclusive: true },
        select: productCardSelect,
        take: 3,
        orderBy: { createdAt: "desc" },
      }),
      getSiteSettings(),
    ]);

    return {
      heroBanners,
      launchProducts: launchProducts.map(mapProductCard),
      bestSellers: bestSellers.map(mapProductCard),
      weekHighlights: weekHighlights.map(mapProductCard),
      exclusiveProducts: exclusiveProducts.map(mapProductCard),
      settings,
    };
  },
  ["home-page-data"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [
      storefrontCache.tags.home,
      storefrontCache.tags.banners,
      storefrontCache.tags.products,
      storefrontCache.tags.settings,
    ],
  },
);

export async function getHomePageData(): Promise<HomePageData> {
  return getCachedHomePageData();
}

const getCachedShopDiscoveryData = unstable_cache(
  async (): Promise<ShopDiscoveryData> => {
    const [featuredBrands, featuredCategories] = await Promise.all([
      prisma.brand.findMany({
        where: { isActive: true, isFeatured: true },
        take: 4,
        orderBy: { name: "asc" },
      }),
      prisma.category.findMany({
        where: { isActive: true, isFeatured: true },
        take: 4,
        orderBy: { name: "asc" },
      }),
    ]);

    return {
      featuredBrands,
      featuredCategories,
    };
  },
  ["shop-discovery-data"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.discovery, storefrontCache.tags.catalog],
  },
);

export async function getShopDiscoveryData(): Promise<ShopDiscoveryData> {
  return getCachedShopDiscoveryData();
}

const getCachedDropsPageData = unstable_cache(
  async (): Promise<DropsPageData> => {
    const [launchProducts, exclusiveProducts, offers] = await Promise.all([
      prisma.product.findMany({
        where: { isActive: true, isNewRelease: true },
        select: productCardSelect,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isExclusive: true },
        select: productCardSelect,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.findMany({
        where: { isActive: true, isOnSale: true },
        select: productCardSelect,
        take: 4,
        orderBy: { createdAt: "desc" },
      }),
    ]);

    return {
      launchProducts: launchProducts.map(mapProductCard),
      exclusiveProducts: exclusiveProducts.map(mapProductCard),
      offers: offers.map(mapProductCard),
    };
  },
  ["drops-page-data"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.drops, storefrontCache.tags.products],
  },
);

export async function getDropsPageData(): Promise<DropsPageData> {
  return getCachedDropsPageData();
}

const getCachedRecommendedProducts = unstable_cache(
  async (limit: number): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      select: productCardSelect,
      take: limit,
      orderBy: [{ reviewCount: "desc" }, { createdAt: "desc" }],
    });

    return products.map(mapProductCard);
  },
  ["recommended-products"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.recommendations, storefrontCache.tags.products],
  },
);

export async function getRecommendedProducts(limit = 4) {
  return getCachedRecommendedProducts(limit);
}

const getCachedCatalogFilters = unstable_cache(
  async (): Promise<CatalogFiltersData> => {
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
  },
  ["catalog-filters"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.catalog, storefrontCache.tags.discovery],
  },
);

export async function getCatalogFilters(): Promise<CatalogFiltersData> {
  return getCachedCatalogFilters();
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

function serializeCatalogSearchInput(searchParams: CatalogSearchInput) {
  const params = new URLSearchParams();

  Object.entries(searchParams)
    .filter(([, value]) => typeof value === "string" && value.trim().length > 0)
    .sort(([left], [right]) => left.localeCompare(right))
    .forEach(([key, value]) => {
      params.set(key, value!.trim());
    });

  return params.toString();
}

const getCachedCatalogPageData = unstable_cache(
  async (serializedSearchParams: string): Promise<CatalogPageData> => {
    const searchParams = Object.fromEntries(new URLSearchParams(serializedSearchParams).entries()) as CatalogSearchInput;
    const page = Math.max(Number(searchParams.page ?? "1") || 1, 1);
    const pageSize = 12;
    const where = buildCatalogWhere(searchParams);

    const [filters, total, products] = await Promise.all([
      getCatalogFilters(),
      prisma.product.count({ where }),
      prisma.product.findMany({
        where,
        select: productCardSelect,
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
  },
  ["catalog-page-data"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.catalog, storefrontCache.tags.products],
  },
);

export async function getCatalogPageData(searchParams: CatalogSearchInput): Promise<CatalogPageData> {
  return getCachedCatalogPageData(serializeCatalogSearchInput(searchParams));
}

const getCachedProductBySlug = unstable_cache(
  async (slug: string): Promise<ProductDetailData | null> => {
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
      select: productCardSelect,
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
  },
  ["product-by-slug"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.products],
  },
);

export async function getProductBySlug(slug: string): Promise<ProductDetailData | null> {
  return getCachedProductBySlug(slug);
}

export async function getProductsByIds(productIds: string[]) {
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true,
    },
    select: productCardSelect,
  });

  return products.map(mapProductCard);
}

const getCachedSearchSuggestions = unstable_cache(
  async (searchQuery: string): Promise<ProductCardData[]> => {
    const products = await prisma.product.findMany({
      where: {
        isActive: true,
        OR: [
          { name: { contains: searchQuery, mode: "insensitive" } },
          { shortDescription: { contains: searchQuery, mode: "insensitive" } },
          { brand: { is: { name: { contains: searchQuery, mode: "insensitive" } } } },
        ],
      },
      select: productCardSelect,
      take: 6,
      orderBy: { createdAt: "desc" },
    });

    return products.map(mapProductCard);
  },
  ["search-suggestions"],
  {
    revalidate: storefrontCache.shortRevalidate,
    tags: [storefrontCache.tags.catalog, storefrontCache.tags.products],
  },
);

export async function getSearchSuggestions(query: string) {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  return getCachedSearchSuggestions(normalizedQuery);
}

const getCachedContentPage = unstable_cache(
  async (slug: string) => {
    return prisma.contentPage.findUnique({
      where: { slug },
    });
  },
  ["content-page"],
  {
    revalidate: storefrontCache.revalidate,
    tags: [storefrontCache.tags.content],
  },
);

export async function getContentPage(slug: string) {
  return getCachedContentPage(slug);
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
