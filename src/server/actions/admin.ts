"use server";

import { revalidatePath, revalidateTag } from "next/cache";

import { auth } from "@/auth";
import { storefrontCache } from "@/lib/cache-tags";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import {
  bannerAdminSchema,
  brandAdminSchema,
  categoryAdminSchema,
  contentPageAdminSchema,
  couponAdminSchema,
  orderStatusAdminSchema,
  productAdminSchema,
  reviewModerationSchema,
  settingsAdminSchema,
} from "@/lib/validators/admin";

async function assertAdmin() {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    throw new Error("Acesso negado.");
  }

  return session;
}

async function refreshProductReviewStats(productId: string) {
  const stats = await prisma.review.aggregate({
    where: {
      productId,
      status: "APPROVED",
    },
    _avg: {
      rating: true,
    },
    _count: {
      rating: true,
    },
  });

  await prisma.product.update({
    where: { id: productId },
    data: {
      ratingAverage: stats._avg.rating ?? 0,
      reviewCount: stats._count.rating,
    },
  });
}

export async function saveProductAction(input: unknown) {
  await assertAdmin();

  const parsed = productAdminSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Dados do produto inválidos.",
    };
  }

  const payload = parsed.data;
  const slug = slugify(payload.slug || payload.name);

  const productData = {
    name: payload.name,
    slug,
    sku: payload.sku,
    brandId: payload.brandId,
    categoryId: payload.categoryId,
    shortDescription: payload.shortDescription,
    description: payload.description,
    colorway: payload.colorway,
    basePriceInCents: payload.basePriceInCents,
    salePriceInCents: payload.salePriceInCents ?? null,
    installmentCount: payload.installmentCount,
    leadTimeInBusinessDays: payload.leadTimeInBusinessDays,
    isFeatured: payload.isFeatured,
    isActive: payload.isActive,
    isExclusive: payload.isExclusive,
    isNewRelease: payload.isNewRelease,
    isOnSale: payload.isOnSale,
    metaTitle: `${payload.name} | Sneaker Stream`,
    metaDescription: payload.shortDescription,
    searchKeywords: payload.keywordList,
    highlights: payload.highlightList,
    specs: payload.specs,
    details: {
      authenticity: "Produto importado com curadoria e conferência interna Sneaker Stream.",
      shipping: "Envio seguro com rastreio e suporte humano rápido.",
    },
  };

  const product = await prisma.$transaction(async (tx) => {
    if (payload.id) {
      await tx.product.update({
        where: { id: payload.id },
        data: productData,
      });

      await tx.productImage.deleteMany({
        where: { productId: payload.id },
      });

      await tx.productVariant.deleteMany({
        where: { productId: payload.id },
      });

      await tx.productImage.createMany({
        data: payload.imageUrls.map((url, index) => ({
          productId: payload.id!,
          url,
          alt: payload.name,
          sortOrder: index,
          isPrimary: index === 0,
        })),
      });

      await tx.productVariant.createMany({
        data: payload.variants.map((variant) => ({
          productId: payload.id!,
          sizeId: variant.sizeId,
          stock: variant.stock,
        })),
      });

      return tx.product.findUniqueOrThrow({
        where: { id: payload.id },
      });
    }

    return tx.product.create({
      data: {
        ...productData,
        images: {
          create: payload.imageUrls.map((url, index) => ({
            url,
            alt: payload.name,
            sortOrder: index,
            isPrimary: index === 0,
          })),
        },
        variants: {
          create: payload.variants.map((variant) => ({
            sizeId: variant.sizeId,
            stock: variant.stock,
          })),
        },
      },
    });
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath(`/shop/${product.slug}`);
  revalidatePath("/admin/produtos");
  revalidateTag(storefrontCache.tags.products, "max");
  revalidateTag(storefrontCache.tags.catalog, "max");
  revalidateTag(storefrontCache.tags.home, "max");
  revalidateTag(storefrontCache.tags.drops, "max");
  revalidateTag(storefrontCache.tags.recommendations, "max");

  return {
    success: true,
    message: "Produto salvo com sucesso.",
    productId: product.id,
  };
}

export async function deleteProductAction(productId: string) {
  await assertAdmin();

  const product = await prisma.product.delete({
    where: { id: productId },
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/produtos");
  revalidatePath(`/shop/${product.slug}`);
  revalidateTag(storefrontCache.tags.products, "max");
  revalidateTag(storefrontCache.tags.catalog, "max");
  revalidateTag(storefrontCache.tags.home, "max");
  revalidateTag(storefrontCache.tags.drops, "max");
  revalidateTag(storefrontCache.tags.recommendations, "max");

  return {
    success: true,
    message: "Produto removido com sucesso.",
  };
}

export async function saveCategoryAction(input: unknown) {
  await assertAdmin();
  const parsed = categoryAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Categoria inválida." };
  }

  const payload = parsed.data;
  const data = {
    name: payload.name,
    slug: slugify(payload.slug || payload.name),
    description: payload.description,
    imageUrl: payload.imageUrl,
    isFeatured: payload.isFeatured,
    isActive: payload.isActive,
  };

  if (payload.id) {
    await prisma.category.update({
      where: { id: payload.id },
      data,
    });
  } else {
    await prisma.category.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/categorias");
  revalidateTag(storefrontCache.tags.catalog, "max");
  revalidateTag(storefrontCache.tags.discovery, "max");

  return { success: true, message: "Categoria salva com sucesso." };
}

export async function saveBrandAction(input: unknown) {
  await assertAdmin();
  const parsed = brandAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Marca inválida." };
  }

  const payload = parsed.data;
  const data = {
    name: payload.name,
    slug: slugify(payload.slug || payload.name),
    description: payload.description,
    logoUrl: payload.logoUrl,
    isFeatured: payload.isFeatured,
    isActive: payload.isActive,
  };

  if (payload.id) {
    await prisma.brand.update({
      where: { id: payload.id },
      data,
    });
  } else {
    await prisma.brand.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin/marcas");
  revalidateTag(storefrontCache.tags.catalog, "max");
  revalidateTag(storefrontCache.tags.discovery, "max");

  return { success: true, message: "Marca salva com sucesso." };
}

export async function saveCouponAction(input: unknown) {
  await assertAdmin();
  const parsed = couponAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Cupom inválido." };
  }

  const payload = parsed.data;
  const data = {
    code: payload.code.toUpperCase(),
    description: payload.description,
    type: payload.type,
    value: payload.value,
    minOrderCents: payload.minOrderCents ?? null,
    maxDiscountCents: payload.maxDiscountCents ?? null,
    usageLimit: payload.usageLimit ?? null,
    startsAt: payload.startsAt ? new Date(payload.startsAt) : null,
    endsAt: payload.endsAt ? new Date(payload.endsAt) : null,
    isActive: payload.isActive,
  };

  if (payload.id) {
    await prisma.coupon.update({
      where: { id: payload.id },
      data,
    });
  } else {
    await prisma.coupon.create({ data });
  }

  revalidatePath("/admin/cupons");

  return { success: true, message: "Cupom salvo com sucesso." };
}

export async function saveBannerAction(input: unknown) {
  await assertAdmin();
  const parsed = bannerAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Banner inválido." };
  }

  const payload = parsed.data;
  const data = {
    title: payload.title,
    subtitle: payload.subtitle,
    eyebrow: payload.eyebrow,
    ctaLabel: payload.ctaLabel,
    ctaHref: payload.ctaHref,
    imageUrl: payload.imageUrl,
    mobileImageUrl: payload.mobileImageUrl,
    placement: payload.placement,
    sortOrder: payload.sortOrder,
    accent: payload.accent,
    isActive: payload.isActive,
  };

  if (payload.id) {
    await prisma.banner.update({
      where: { id: payload.id },
      data,
    });
  } else {
    await prisma.banner.create({ data });
  }

  revalidatePath("/");
  revalidatePath("/drops");
  revalidatePath("/admin/banners");
  revalidateTag(storefrontCache.tags.banners, "max");
  revalidateTag(storefrontCache.tags.home, "max");
  revalidateTag(storefrontCache.tags.drops, "max");

  return { success: true, message: "Banner salvo com sucesso." };
}

export async function saveContentPageAction(input: unknown) {
  await assertAdmin();
  const parsed = contentPageAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Conteúdo inválido." };
  }

  const payload = parsed.data;
  let body: object;

  try {
    body = JSON.parse(payload.body);
  } catch {
    body = {
      content: payload.body,
    };
  }

  const data = {
    slug: slugify(payload.slug),
    title: payload.title,
    heroTitle: payload.heroTitle,
    heroSubtitle: payload.heroSubtitle,
    body,
    seoTitle: payload.seoTitle,
    seoDescription: payload.seoDescription,
  };

  if (payload.id) {
    await prisma.contentPage.update({
      where: { id: payload.id },
      data,
    });
  } else {
    await prisma.contentPage.create({ data });
  }

  revalidatePath(`/${data.slug}`);
  revalidatePath("/admin/conteudo");
  revalidateTag(storefrontCache.tags.content, "max");

  return { success: true, message: "Página institucional salva com sucesso." };
}

export async function saveSettingsAction(input: unknown) {
  await assertAdmin();
  const parsed = settingsAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Configurações inválidas." };
  }

  await prisma.settings.upsert({
    where: { id: "store" },
    create: {
      id: "store",
      ...parsed.data,
    },
    update: parsed.data,
  });

  revalidatePath("/");
  revalidatePath("/admin/configuracoes");
  revalidateTag(storefrontCache.tags.settings, "max");
  revalidateTag(storefrontCache.tags.home, "max");

  return { success: true, message: "Configurações da loja salvas com sucesso." };
}

export async function updateOrderStatusAction(input: unknown) {
  await assertAdmin();
  const parsed = orderStatusAdminSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Status inválido." };
  }

  const payload = parsed.data;
  await prisma.order.update({
    where: { id: payload.orderId },
    data: {
      status: payload.status,
      trackingCode: payload.trackingCode,
      paidAt: payload.status === "PAID" ? new Date() : undefined,
      shippedAt: payload.status === "SHIPPED" ? new Date() : undefined,
      deliveredAt: payload.status === "DELIVERED" ? new Date() : undefined,
      cancelledAt: payload.status === "CANCELLED" ? new Date() : undefined,
    },
  });

  revalidatePath("/admin/pedidos");
  revalidatePath("/meus-pedidos");

  return { success: true, message: "Status do pedido atualizado." };
}

export async function moderateReviewAction(input: unknown) {
  await assertAdmin();
  const parsed = reviewModerationSchema.safeParse(input);

  if (!parsed.success) {
    return { success: false, message: parsed.error.issues[0]?.message ?? "Avaliação inválida." };
  }

  const review = await prisma.review.update({
    where: { id: parsed.data.reviewId },
    data: { status: parsed.data.status },
  });

  await refreshProductReviewStats(review.productId);

  revalidatePath("/admin/avaliacoes");
  revalidatePath("/shop");
  revalidateTag(storefrontCache.tags.products, "max");
  revalidateTag(storefrontCache.tags.catalog, "max");
  revalidateTag(storefrontCache.tags.home, "max");
  revalidateTag(storefrontCache.tags.recommendations, "max");

  return { success: true, message: "Avaliação atualizada." };
}
