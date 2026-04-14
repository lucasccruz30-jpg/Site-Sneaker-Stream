import { z } from "zod";

export const sizeStockSchema = z.object({
  sizeId: z.string().min(1),
  sizeLabel: z.string().min(1),
  stock: z.number().int().min(0),
});

export const specSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
});

export const productAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(3),
  slug: z.string().optional(),
  sku: z.string().min(3),
  brandId: z.string().min(1),
  categoryId: z.string().min(1),
  shortDescription: z.string().min(20),
  description: z.string().min(40),
  colorway: z.string().optional(),
  basePriceInCents: z.number().int().min(0),
  salePriceInCents: z.number().int().min(0).optional().nullable(),
  installmentCount: z.number().int().min(1).max(12),
  leadTimeInBusinessDays: z.number().int().min(1).max(20),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
  isExclusive: z.boolean(),
  isNewRelease: z.boolean(),
  isOnSale: z.boolean(),
  imageUrls: z.array(z.string().min(1)).min(1),
  keywordList: z.array(z.string()).default([]),
  highlightList: z.array(z.string()).default([]),
  specs: z.array(specSchema).default([]),
  variants: z.array(sizeStockSchema).min(1),
});

export const categoryAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  imageUrl: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export const brandAdminSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().min(10),
  logoUrl: z.string().optional(),
  isFeatured: z.boolean(),
  isActive: z.boolean(),
});

export const couponAdminSchema = z.object({
  id: z.string().optional(),
  code: z.string().min(3),
  description: z.string().optional(),
  type: z.enum(["PERCENTAGE", "FIXED_AMOUNT", "FREE_SHIPPING"]),
  value: z.number().int().min(0),
  minOrderCents: z.number().int().min(0).optional().nullable(),
  maxDiscountCents: z.number().int().min(0).optional().nullable(),
  usageLimit: z.number().int().min(1).optional().nullable(),
  isActive: z.boolean(),
  startsAt: z.string().optional().nullable(),
  endsAt: z.string().optional().nullable(),
});

export const bannerAdminSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3),
  subtitle: z.string().optional(),
  eyebrow: z.string().optional(),
  ctaLabel: z.string().optional(),
  ctaHref: z.string().optional(),
  imageUrl: z.string().optional(),
  mobileImageUrl: z.string().optional(),
  placement: z.enum(["HERO", "FEATURED", "MIDPAGE", "FOOTER", "DROPS"]),
  sortOrder: z.number().int().min(0),
  accent: z.string().optional(),
  isActive: z.boolean(),
});

export const contentPageAdminSchema = z.object({
  id: z.string().optional(),
  slug: z.string().min(2),
  title: z.string().min(3),
  heroTitle: z.string().min(3),
  heroSubtitle: z.string().optional(),
  body: z.string().min(2),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
});

export const settingsAdminSchema = z.object({
  storeName: z.string().min(2),
  tagline: z.string().min(5),
  supportEmail: z.email(),
  supportPhone: z.string().min(10),
  whatsapp: z.string().optional(),
  logoUrl: z.string().optional(),
  faviconUrl: z.string().optional(),
  primaryColor: z.string().min(4),
  accentColor: z.string().min(4),
  highlightColor: z.string().min(4),
  offWhiteColor: z.string().min(4),
  metaTitle: z.string().min(10),
  metaDescription: z.string().min(20),
  shippingLeadText: z.string().min(5),
  announcementText: z.string().optional(),
  instagramUrl: z.string().optional(),
  tiktokUrl: z.string().optional(),
  freeShippingThresholdCents: z.number().int().min(0).optional().nullable(),
  pixDiscountPercentage: z.number().int().min(0).max(20),
  authenticityMessage: z.string().min(10),
});

export const orderStatusAdminSchema = z.object({
  orderId: z.string().min(1),
  status: z.enum(["PENDING", "PAID", "PICKING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  trackingCode: z.string().optional(),
});

export const reviewModerationSchema = z.object({
  reviewId: z.string().min(1),
  status: z.enum(["APPROVED", "REJECTED"]),
});
