import { OrderStatus, PaymentMethod, PaymentStatus } from "@prisma/client";

import type { ProductCardData } from "@/types";

export function formatCurrency(valueInCents: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(valueInCents / 100);
}

export function formatDateBR(value: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

export function getEffectivePrice(product: Pick<ProductCardData, "basePriceInCents" | "salePriceInCents">) {
  return product.salePriceInCents ?? product.basePriceInCents;
}

export function getDiscountPercentage(product: Pick<ProductCardData, "basePriceInCents" | "salePriceInCents">) {
  if (!product.salePriceInCents || product.salePriceInCents >= product.basePriceInCents) {
    return 0;
  }

  return Math.round(((product.basePriceInCents - product.salePriceInCents) / product.basePriceInCents) * 100);
}

export function getInstallmentText(valueInCents: number, count = 10) {
  return `${count}x de ${formatCurrency(Math.round(valueInCents / count))} sem juros`;
}

export function getStockStatus(totalStock: number) {
  if (totalStock <= 0) {
    return { label: "Indisponível", tone: "destructive" as const };
  }

  if (totalStock <= 4) {
    return { label: "Pouco estoque", tone: "warning" as const };
  }

  return { label: "Disponível", tone: "default" as const };
}

export function orderStatusLabel(status: OrderStatus) {
  const labels: Record<OrderStatus, string> = {
    PENDING: "Pendente",
    PAID: "Pago",
    PICKING: "Em separação",
    SHIPPED: "Enviado",
    DELIVERED: "Entregue",
    CANCELLED: "Cancelado",
  };

  return labels[status];
}

export function paymentMethodLabel(method: PaymentMethod) {
  return method === "PIX" ? "PIX" : "Cartão";
}

export function paymentStatusLabel(status: PaymentStatus) {
  const labels: Record<PaymentStatus, string> = {
    PENDING: "Pendente",
    AUTHORIZED: "Autorizado",
    PAID: "Pago",
    FAILED: "Falhou",
    REFUNDED: "Reembolsado",
  };

  return labels[status];
}

export function formatPhone(phone: string) {
  const digits = phone.replace(/\D/g, "");

  if (digits.length === 11) {
    return digits.replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  }

  return phone;
}
