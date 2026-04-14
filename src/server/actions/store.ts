"use server";

import { revalidatePath } from "next/cache";
import { hash } from "bcryptjs";

import { auth } from "@/auth";
import { calculateOrderTotals, generatePixCode } from "@/lib/payments";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/validators/auth";
import { checkoutSchema, reviewSchema } from "@/lib/validators/store";
import { getSiteSettings } from "@/server/queries/storefront";

function createOrderNumber() {
  const now = new Date();
  const datePart = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, "0")}${String(now.getDate()).padStart(2, "0")}`;
  const randomPart = Math.floor(1000 + Math.random() * 9000);
  return `SS-${datePart}-${randomPart}`;
}

export async function registerUserAction(input: unknown) {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Não foi possível concluir o cadastro.",
    };
  }

  const existingUser = await prisma.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (existingUser) {
    return {
      success: false,
      message: "Já existe uma conta com esse e-mail.",
    };
  }

  const passwordHash = await hash(parsed.data.password, 10);

  await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      passwordHash,
    },
  });

  revalidatePath("/admin/clientes");

  return {
    success: true,
    message: "Cadastro realizado com sucesso. Agora é só entrar na sua conta.",
  };
}

export async function createOrderAction(input: unknown) {
  const session = await auth();
  const parsed = checkoutSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Confira os dados do checkout.",
    };
  }

  const payload = parsed.data;
  const variantIds = payload.items.map((item) => item.variantId);
  const variants = await prisma.productVariant.findMany({
    where: {
      id: { in: variantIds },
    },
    include: {
      size: true,
      product: {
        include: {
          brand: true,
          images: {
            orderBy: { sortOrder: "asc" },
            take: 1,
          },
        },
      },
    },
  });

  if (variants.length !== payload.items.length) {
    return {
      success: false,
      message: "Um ou mais itens do carrinho não estão mais disponíveis.",
    };
  }

  const variantMap = new Map(variants.map((variant) => [variant.id, variant]));
  const subtotalCents = payload.items.reduce((sum, item) => {
    const variant = variantMap.get(item.variantId);
    const price = variant?.product.salePriceInCents ?? variant?.product.basePriceInCents ?? item.unitPriceCents;
    return sum + price * item.quantity;
  }, 0);

  const coupon = payload.couponCode
    ? await prisma.coupon.findUnique({
        where: { code: payload.couponCode.trim().toUpperCase() },
      })
    : null;
  const settings = await getSiteSettings();
  const totals = calculateOrderTotals({
    subtotalCents,
    coupon,
    shippingMethod: payload.shippingMethod,
    settings,
    paymentMethod: payload.paymentMethod,
  });

  for (const item of payload.items) {
    const variant = variantMap.get(item.variantId);
    if (!variant || variant.stock < item.quantity) {
      return {
        success: false,
        message: `${item.productName} na numeração ${item.sizeLabel} ficou indisponível ou com estoque insuficiente.`,
      };
    }
  }

  const orderNumber = createOrderNumber();
  const shippingAddressJson = {
    recipient: payload.name,
    phone: payload.phone,
    zipCode: payload.zipCode,
    street: payload.street,
    number: payload.number,
    complement: payload.complement ?? "",
    neighborhood: payload.neighborhood,
    city: payload.city,
    state: payload.state,
    country: "Brasil",
  };

  const pixCode =
    payload.paymentMethod === "PIX" ? generatePixCode(orderNumber, totals.totalCents) : null;

  const order = await prisma.$transaction(async (tx) => {
    let shippingAddressId: string | undefined;

    if (session?.user.id && payload.saveAddress) {
      const address = await tx.address.create({
        data: {
          userId: session.user.id,
          label: "Entrega",
          recipient: payload.name,
          phone: payload.phone,
          zipCode: payload.zipCode,
          street: payload.street,
          number: payload.number,
          complement: payload.complement,
          neighborhood: payload.neighborhood,
          city: payload.city,
          state: payload.state,
          isDefaultShipping: false,
        },
      });

      shippingAddressId = address.id;
    }

    for (const item of payload.items) {
      await tx.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: {
            decrement: item.quantity,
          },
        },
      });
    }

    const createdOrder = await tx.order.create({
      data: {
        userId: session?.user.id,
        shippingAddressId,
        orderNumber,
        guestName: payload.name,
        guestEmail: payload.email,
        guestPhone: payload.phone,
        shippingAddressJson,
        subtotalCents,
        discountCents: totals.couponDiscountCents + totals.pixDiscountCents,
        shippingCents: totals.shippingCents,
        totalCents: totals.totalCents,
        couponId: coupon?.id,
        couponCode: coupon?.code,
        notes: payload.notes,
        paymentMethod: payload.paymentMethod,
        paymentStatus: payload.paymentMethod === "PIX" ? "PENDING" : "AUTHORIZED",
        paymentReference:
          payload.paymentMethod === "CARD"
            ? `CARD-${orderNumber}`
            : `PIX-${orderNumber}`,
        pixCode,
        pixExpiresAt:
          payload.paymentMethod === "PIX"
            ? new Date(Date.now() + 1000 * 60 * 30)
            : null,
        items: {
          create: payload.items.map((item) => {
            const variant = variantMap.get(item.variantId)!;
            const currentPrice =
              variant.product.salePriceInCents ?? variant.product.basePriceInCents;

            return {
              productId: variant.product.id,
              variantId: variant.id,
              productName: variant.product.name,
              productSlug: variant.product.slug,
              productSku: variant.product.sku,
              sizeLabel: variant.size.label,
              imageUrl: variant.product.images[0]?.url ?? item.imageUrl,
              quantity: item.quantity,
              unitPriceCents: currentPrice,
              lineTotalCents: currentPrice * item.quantity,
            };
          }),
        },
      },
    });

    return createdOrder;
  });

  revalidatePath("/");
  revalidatePath("/shop");
  revalidatePath("/admin");
  revalidatePath("/admin/pedidos");
  revalidatePath("/meus-pedidos");

  return {
    success: true,
    message:
      payload.paymentMethod === "PIX"
        ? "Pedido criado com sucesso. Finalize o pagamento via PIX."
        : "Pedido criado com sucesso. Pagamento preparado para integração com gateway real.",
    orderId: order.id,
    orderNumber: order.orderNumber,
    pixCode,
  };
}

export async function createReviewAction(input: unknown) {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Faça login para avaliar este produto.",
    };
  }

  const parsed = reviewSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Confira os dados da sua avaliação.",
    };
  }

  await prisma.review.create({
    data: {
      userId: session.user.id,
      productId: parsed.data.productId,
      rating: parsed.data.rating,
      title: parsed.data.title,
      comment: parsed.data.comment,
      status: "PENDING",
    },
  });

  revalidatePath(`/shop/${parsed.data.productId}`);
  revalidatePath("/admin/avaliacoes");

  return {
    success: true,
    message: "Avaliação enviada para moderação.",
  };
}
