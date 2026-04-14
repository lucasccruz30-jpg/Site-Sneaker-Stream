import { Coupon, CouponType } from "@prisma/client";

type TotalsInput = {
  subtotalCents: number;
  coupon?: Coupon | null;
  shippingMethod: "standard" | "express";
  settings: {
    freeShippingThresholdCents?: number | null;
    pixDiscountPercentage: number;
  };
  paymentMethod?: "PIX" | "CARD";
};

export function calculateShipping(subtotalCents: number, method: "standard" | "express", freeShippingThresholdCents?: number | null) {
  if (freeShippingThresholdCents && subtotalCents >= freeShippingThresholdCents) {
    return 0;
  }

  return method === "express" ? 3490 : 1990;
}

export function isCouponActive(coupon?: Coupon | null) {
  if (!coupon || !coupon.isActive) {
    return false;
  }

  const now = new Date();

  if (coupon.startsAt && coupon.startsAt > now) {
    return false;
  }

  if (coupon.endsAt && coupon.endsAt < now) {
    return false;
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    return false;
  }

  return true;
}

export function calculateCouponDiscount(subtotalCents: number, shippingCents: number, coupon?: Coupon | null) {
  if (!isCouponActive(coupon)) {
    return 0;
  }

  if (coupon?.minOrderCents && subtotalCents < coupon.minOrderCents) {
    return 0;
  }

  if (!coupon) {
    return 0;
  }

  if (coupon.type === CouponType.PERCENTAGE) {
    const percentageDiscount = Math.round((subtotalCents * coupon.value) / 100);
    if (coupon.maxDiscountCents) {
      return Math.min(percentageDiscount, coupon.maxDiscountCents);
    }
    return percentageDiscount;
  }

  if (coupon.type === CouponType.FIXED_AMOUNT) {
    return Math.min(coupon.value, subtotalCents);
  }

  return shippingCents;
}

export function calculateOrderTotals({ subtotalCents, coupon, shippingMethod, settings, paymentMethod }: TotalsInput) {
  const shippingCents = calculateShipping(subtotalCents, shippingMethod, settings.freeShippingThresholdCents);
  const couponDiscountCents = calculateCouponDiscount(subtotalCents, shippingCents, coupon);
  const pixDiscountCents =
    paymentMethod === "PIX" ? Math.round((subtotalCents * settings.pixDiscountPercentage) / 100) : 0;
  const totalCents = Math.max(subtotalCents + shippingCents - couponDiscountCents - pixDiscountCents, 0);

  return {
    shippingCents,
    couponDiscountCents,
    pixDiscountCents,
    totalCents,
  };
}

export function generatePixCode(orderNumber: string, totalCents: number) {
  return `PIX|SNEAKER-STREAM|${orderNumber}|${totalCents}`;
}
