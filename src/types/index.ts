import { BannerPlacement, CouponType, OrderStatus, PaymentMethod, PaymentStatus, ReviewStatus, UserRole } from "@prisma/client";

export type NavLink = {
  href: string;
  label: string;
  description?: string;
};

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  brand: string;
  category: string;
  shortDescription: string;
  colorway?: string | null;
  basePriceInCents: number;
  salePriceInCents?: number | null;
  ratingAverage: number;
  reviewCount: number;
  totalStock: number;
  sizes: string[];
  image: string;
  isFeatured: boolean;
  isExclusive: boolean;
  isNewRelease: boolean;
  isOnSale: boolean;
};

export type ProductDetailData = ProductCardData & {
  description: string;
  metaTitle?: string | null;
  metaDescription?: string | null;
  installmentCount: number;
  leadTimeInBusinessDays: number;
  highlights: string[];
  specs: Array<{ label: string; value: string }>;
  details: Record<string, string>;
  gallery: Array<{ id: string; url: string; alt: string; isPrimary: boolean }>;
  variants: Array<{
    id: string;
    sizeId: string;
    sizeLabel: string;
    stock: number;
  }>;
  reviews: Array<{
    id: string;
    userName: string;
    rating: number;
    title?: string | null;
    comment: string;
    verifiedPurchase: boolean;
    createdAt: Date;
    status: ReviewStatus;
  }>;
  relatedProducts: ProductCardData[];
};

export type BannerData = {
  id: string;
  title: string;
  subtitle?: string | null;
  eyebrow?: string | null;
  ctaLabel?: string | null;
  ctaHref?: string | null;
  imageUrl?: string | null;
  mobileImageUrl?: string | null;
  placement: BannerPlacement;
  accent?: string | null;
};

export type SiteSettingsData = {
  storeName: string;
  tagline: string;
  supportEmail: string;
  supportPhone: string;
  whatsapp?: string | null;
  logoUrl?: string | null;
  faviconUrl?: string | null;
  primaryColor: string;
  accentColor: string;
  highlightColor: string;
  offWhiteColor: string;
  metaTitle: string;
  metaDescription: string;
  shippingLeadText: string;
  announcementText?: string | null;
  instagramUrl?: string | null;
  tiktokUrl?: string | null;
  freeShippingThresholdCents?: number | null;
  pixDiscountPercentage: number;
  authenticityMessage: string;
};

export type HomePageData = {
  heroBanners: BannerData[];
  launchProducts: ProductCardData[];
  bestSellers: ProductCardData[];
  weekHighlights: ProductCardData[];
  exclusiveProducts: ProductCardData[];
  settings: SiteSettingsData;
};

export type ShopDiscoveryData = {
  featuredBrands: Array<{ id: string; name: string; slug: string; description?: string | null }>;
  featuredCategories: Array<{ id: string; name: string; slug: string; description?: string | null; imageUrl?: string | null }>;
};

export type DropsPageData = {
  launchProducts: ProductCardData[];
  exclusiveProducts: ProductCardData[];
  offers: ProductCardData[];
};

export type CatalogFiltersData = {
  brands: Array<{ id: string; name: string; slug: string }>;
  categories: Array<{ id: string; name: string; slug: string }>;
  sizes: Array<{ id: string; label: string }>;
  minPriceInCents: number;
  maxPriceInCents: number;
};

export type CatalogSearchInput = {
  search?: string;
  brand?: string;
  category?: string;
  size?: string;
  minPrice?: string;
  maxPrice?: string;
  color?: string;
  availability?: string;
  highlight?: string;
  sort?: string;
  page?: string;
};

export type CatalogPageData = {
  products: ProductCardData[];
  total: number;
  page: number;
  pageSize: number;
  filters: CatalogFiltersData;
};

export type CartLineItem = {
  productId: string;
  variantId: string;
  productName: string;
  productSlug: string;
  brand: string;
  imageUrl: string;
  sizeLabel: string;
  quantity: number;
  unitPriceCents: number;
  compareAtPriceCents?: number | null;
  maxStock: number;
};

export type CheckoutPayload = {
  name: string;
  email: string;
  phone: string;
  zipCode: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  paymentMethod: PaymentMethod;
  shippingMethod: "standard" | "express";
  couponCode?: string;
  notes?: string;
  saveAddress?: boolean;
  items: CartLineItem[];
};

export type OrderSummaryData = {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  totalCents: number;
  placedAt: Date;
  trackingCode?: string | null;
  items: Array<{
    id: string;
    productName: string;
    productSlug: string;
    imageUrl: string;
    quantity: number;
    sizeLabel: string;
    lineTotalCents: number;
  }>;
};

export type AdminMetric = {
  label: string;
  value: string;
  delta?: string;
  hint?: string;
};

export type AdminDashboardData = {
  metrics: AdminMetric[];
  recentOrders: OrderSummaryData[];
  lowStockProducts: Array<{ id: string; name: string; slug: string; stock: number; brand: string }>;
  topProducts: Array<{ id: string; name: string; quantity: number; revenueCents: number }>;
  recentCustomers: Array<{ id: string; name: string; email: string; createdAt: Date; role: UserRole }>;
  revenueByMonth: Array<{ label: string; totalCents: number }>;
};

export type CouponData = {
  id: string;
  code: string;
  description?: string | null;
  type: CouponType;
  value: number;
  isActive: boolean;
  minOrderCents?: number | null;
  maxDiscountCents?: number | null;
  usageLimit?: number | null;
  usedCount: number;
  endsAt?: Date | null;
};

export type ContentSection = {
  title: string;
  content: string;
};
