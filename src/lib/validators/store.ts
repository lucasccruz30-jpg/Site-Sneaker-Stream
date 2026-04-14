import { z } from "zod";

export const newsletterSchema = z.object({
  name: z.string().min(2, "Informe seu nome").optional().or(z.literal("")),
  email: z.email("Informe um e-mail válido").trim().toLowerCase(),
});

export const contactSchema = z.object({
  name: z.string().min(3, "Informe seu nome"),
  email: z.email("Informe um e-mail válido").trim().toLowerCase(),
  phone: z.string().min(10, "Informe um telefone válido"),
  subject: z.string().min(3, "Informe o assunto"),
  message: z.string().min(20, "Escreva uma mensagem com mais detalhes"),
});

export const reviewSchema = z.object({
  productId: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  title: z.string().max(80).optional(),
  comment: z.string().min(12, "Descreva sua experiência"),
});

export const cartItemSchema = z.object({
  productId: z.string().min(1),
  variantId: z.string().min(1),
  productName: z.string().min(1),
  productSlug: z.string().min(1),
  brand: z.string().min(1),
  imageUrl: z.string().min(1),
  sizeLabel: z.string().min(1),
  quantity: z.number().int().min(1).max(5),
  unitPriceCents: z.number().int().nonnegative(),
  compareAtPriceCents: z.number().int().nonnegative().optional().nullable(),
  maxStock: z.number().int().min(0),
});

export const checkoutSchema = z.object({
  name: z.string().min(3, "Informe o nome completo"),
  email: z.email("Informe um e-mail válido").trim().toLowerCase(),
  phone: z.string().min(10, "Informe um telefone válido"),
  zipCode: z.string().min(8, "CEP inválido"),
  street: z.string().min(3, "Informe a rua"),
  number: z.string().min(1, "Informe o número"),
  complement: z.string().optional(),
  neighborhood: z.string().min(2, "Informe o bairro"),
  city: z.string().min(2, "Informe a cidade"),
  state: z.string().min(2, "Informe o estado"),
  paymentMethod: z.enum(["PIX", "CARD"]),
  shippingMethod: z.enum(["standard", "express"]),
  couponCode: z.string().max(30).optional(),
  notes: z.string().max(300).optional(),
  saveAddress: z.boolean().optional(),
  items: z.array(cartItemSchema).min(1, "Seu carrinho está vazio"),
});
