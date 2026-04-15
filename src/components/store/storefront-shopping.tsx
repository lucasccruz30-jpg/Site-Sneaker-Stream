"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import { Heart, Minus, Plus, ShieldCheck, ShoppingBag, Trash2, Truck } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/hooks/use-cart";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { formatCurrency } from "@/lib/format";
import { checkoutSchema } from "@/lib/validators/store";
import { createOrderAction } from "@/server/actions/store";
import { cn } from "@/lib/utils";
import type { CartLineItem, ProductCardData, SiteSettingsData } from "@/types";

import { EmptyState } from "@/components/shared/empty-state";
import { ProductGrid } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkoutFormSchema = checkoutSchema.omit({ items: true });

const shippingOptions = [
  {
    value: "standard" as const,
    title: "Frete padrao",
    description: "Entrega segura com rastreio completo.",
  },
  {
    value: "express" as const,
    title: "Frete expresso",
    description: "Prazo mais curto para pedidos prioritarios.",
  },
];

const paymentOptions = [
  {
    value: "PIX" as const,
    title: "PIX",
    description: "Confirmacao rapida e destaque comercial para conversao.",
  },
  {
    value: "CARD" as const,
    title: "Cartao",
    description: "Estrutura pronta para integracao com gateway real.",
  },
];

function calculatePreviewTotals({
  subtotal,
  shippingMethod,
  paymentMethod,
  settings,
}: {
  subtotal: number;
  shippingMethod: "standard" | "express";
  paymentMethod: "PIX" | "CARD";
  settings: SiteSettingsData;
}) {
  const freeShippingThreshold = settings.freeShippingThresholdCents ?? 0;
  const shipping =
    freeShippingThreshold > 0 && subtotal >= freeShippingThreshold
      ? 0
      : shippingMethod === "express"
        ? 3490
        : 1990;
  const pixDiscount =
    paymentMethod === "PIX" ? Math.round((subtotal * settings.pixDiscountPercentage) / 100) : 0;

  return {
    shipping,
    pixDiscount,
    total: Math.max(subtotal + shipping - pixDiscount, 0),
  };
}

function FieldError({ message }: { message?: string }) {
  if (!message) {
    return null;
  }

  return <p className="text-xs text-brand-wine">{message}</p>;
}

function CartSummary({ items, settings }: { items: CartLineItem[]; settings: SiteSettingsData }) {
  const [couponCode, setCouponCode] = useState("");
  const subtotal = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);
  const preview = calculatePreviewTotals({
    subtotal,
    shippingMethod: "standard",
    paymentMethod: "PIX",
    settings,
  });
  const freeShippingThreshold = settings.freeShippingThresholdCents ?? 0;
  const remainingForFreeShipping = Math.max(freeShippingThreshold - subtotal, 0);
  const progress = freeShippingThreshold ? Math.min((subtotal / freeShippingThreshold) * 100, 100) : 100;
  const checkoutHref = couponCode.trim()
    ? `/checkout?coupon=${encodeURIComponent(couponCode.trim().toUpperCase())}`
    : "/checkout";

  return (
    <div className="space-y-5 lg:sticky lg:top-28">
      <div className="store-panel h-fit space-y-5 p-6">
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Resumo</p>
          <h2 className="mt-3 font-heading text-3xl text-brand-black">Seu pedido</h2>
        </div>

        {freeShippingThreshold ? (
          <div className="rounded-2xl border border-brand-black/8 bg-[#f8f4ef] p-4">
            <div className="flex items-center justify-between gap-4 text-sm text-brand-charcoal">
              <span>Frete gratis</span>
              <span className="font-medium text-brand-black">
                {remainingForFreeShipping > 0
                  ? `Faltam ${formatCurrency(remainingForFreeShipping)}`
                  : "Liberado"}
              </span>
            </div>
            <div className="mt-3 h-2 rounded-full bg-brand-black/8">
              <div className="h-2 rounded-full bg-brand-wine" style={{ width: `${progress}%` }} />
            </div>
          </div>
        ) : null}

        <div className="space-y-3 text-sm text-brand-charcoal">
          <div className="flex items-center justify-between">
            <span>Subtotal</span>
            <span className="text-brand-black">{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Frete estimado</span>
            <span className="text-brand-black">{formatCurrency(preview.shipping)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Economia no PIX</span>
            <span className="text-brand-black">-{formatCurrency(preview.pixDiscount)}</span>
          </div>
          <div className="flex items-center justify-between border-t border-brand-black/8 pt-3 text-base font-semibold">
            <span className="text-brand-black">Total estimado</span>
            <span className="text-brand-black">{formatCurrency(preview.total)}</span>
          </div>
        </div>

        <div className="space-y-3">
          <Input
            value={couponCode}
            onChange={(event) => setCouponCode(event.target.value)}
            placeholder="Cupom de desconto"
            className="store-input"
          />
          <Button asChild className="h-12 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
            <Link href={checkoutHref}>Ir para o checkout</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 w-full rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
          >
            <Link href="/shop">Continuar comprando</Link>
          </Button>
        </div>
      </div>

      <div className="store-panel-muted space-y-3 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="mt-0.5 size-5 text-brand-wine" />
          <p className="text-sm leading-7 text-brand-charcoal">
            Autenticidade verificada e suporte consultivo para reduzir duvidas antes da compra.
          </p>
        </div>
        <div className="flex items-start gap-3">
          <Truck className="mt-0.5 size-5 text-brand-wine" />
          <p className="text-sm leading-7 text-brand-charcoal">
            Rastreio, politica clara de troca e operacao organizada para proteger a confianca da marca.
          </p>
        </div>
      </div>
    </div>
  );
}

export function CartView({
  recommendedProducts,
  settings,
}: {
  recommendedProducts: ProductCardData[];
  settings: SiteSettingsData;
}) {
  const items = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);

  if (!items.length) {
    return (
      <EmptyState
        title="Seu carrinho esta vazio"
        description="Adicione os sneakers mais desejados e volte para finalizar a compra em poucos cliques."
        actionLabel="Explorar catalogo"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="space-y-10">
      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {items.map((item) => (
            <article key={item.variantId} className="store-panel grid gap-5 p-5 sm:grid-cols-[140px_1fr]">
              <Link href={`/shop/${item.productSlug}`} className="relative aspect-square overflow-hidden rounded-lg border border-brand-black/10 bg-[#ece6e1]">
                <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="160px" />
              </Link>
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-brand-warm-gray">{item.brand}</p>
                    <Link href={`/shop/${item.productSlug}`}>
                      <h3 className="mt-2 font-heading text-3xl text-brand-black">{item.productName}</h3>
                    </Link>
                    <p className="mt-2 text-sm text-brand-charcoal">Numeracao {item.sizeLabel}</p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    className="border-brand-black/10 bg-white text-brand-black hover:bg-white"
                    onClick={() => removeItem(item.variantId)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-2 rounded-lg border border-brand-black/10 bg-white p-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-md text-brand-black hover:bg-black/5"
                      onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                    >
                      <Minus className="size-4" />
                    </Button>
                    <span className="min-w-8 text-center text-brand-black">{item.quantity}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="rounded-md text-brand-black hover:bg-black/5"
                      onClick={() => updateQuantity(item.variantId, item.quantity + 1)}
                    >
                      <Plus className="size-4" />
                    </Button>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-brand-charcoal">Total do item</p>
                    <p className="text-xl font-semibold text-brand-black">
                      {formatCurrency(item.unitPriceCents * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        <CartSummary items={items} settings={settings} />
      </div>

      {recommendedProducts.length ? (
        <div className="space-y-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Continuar comprando</p>
              <h2 className="mt-2 font-heading text-4xl text-brand-black">Pares que ajudam a elevar o ticket</h2>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-lg border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
            >
              <Link href="/shop">Ver catalogo</Link>
            </Button>
          </div>
          <ProductGrid products={recommendedProducts.slice(0, 4)} />
        </div>
      ) : null}
    </div>
  );
}

export function CheckoutView({ settings }: { settings: SiteSettingsData }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session } = useSession();
  const items = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const [isPending, startTransition] = useTransition();

  const form = useForm({
    resolver: zodResolver(checkoutFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      zipCode: "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      paymentMethod: "PIX" as const,
      shippingMethod: "standard" as const,
      couponCode: searchParams.get("coupon") ?? "",
      notes: "",
      saveAddress: true,
    },
  });

  useEffect(() => {
    if (session?.user?.name) {
      form.setValue("name", session.user.name);
      form.setValue("email", session.user.email ?? "");
    }
  }, [session, form]);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0), [items]);
  const shippingMethod = useWatch({ control: form.control, name: "shippingMethod" });
  const paymentMethod = useWatch({ control: form.control, name: "paymentMethod" });
  const couponCode = useWatch({ control: form.control, name: "couponCode" });
  const preview = calculatePreviewTotals({
    subtotal,
    shippingMethod: shippingMethod ?? "standard",
    paymentMethod: paymentMethod ?? "PIX",
    settings,
  });

  if (!items.length) {
    return (
      <EmptyState
        title="Nada para finalizar ainda"
        description="Seu checkout aparece aqui assim que voce adicionar produtos ao carrinho."
        actionLabel="Voltar para o shop"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_390px]">
      <form
        id="checkout-form"
        className="space-y-6"
        onSubmit={form.handleSubmit((values) => {
          startTransition(async () => {
            const result = await createOrderAction({
              ...values,
              items,
            });

            if (!result.success) {
              toast.error(result.message);
              return;
            }

            clearCart();
            toast.success(result.message);
            router.push(`/checkout/success?order=${result.orderNumber}${result.pixCode ? `&pix=${encodeURIComponent(result.pixCode)}` : ""}`);
          });
        })}
      >
        {!session?.user ? (
          <div className="store-panel-muted p-5">
            <p className="text-sm leading-7 text-brand-charcoal">
              Checkout como convidado liberado. Se preferir, faca login para salvar endereco e acompanhar pedidos com mais facilidade.
            </p>
          </div>
        ) : null}

        <section className="store-panel space-y-5 p-6">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Identificacao</p>
            <h2 className="mt-3 font-heading text-4xl text-brand-black">Seus dados</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Input {...form.register("name")} placeholder="Nome completo" className="store-input" />
              <FieldError message={form.formState.errors.name?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("email")} type="email" placeholder="E-mail" className="store-input" />
              <FieldError message={form.formState.errors.email?.message} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Input {...form.register("phone")} placeholder="Telefone" className="store-input" />
              <FieldError message={form.formState.errors.phone?.message} />
            </div>
          </div>
        </section>

        <section className="store-panel space-y-5 p-6">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Entrega</p>
            <h2 className="mt-3 font-heading text-4xl text-brand-black">Endereco e frete</h2>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Input {...form.register("zipCode")} placeholder="CEP" className="store-input" />
              <FieldError message={form.formState.errors.zipCode?.message} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Input {...form.register("street")} placeholder="Rua" className="store-input" />
              <FieldError message={form.formState.errors.street?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("number")} placeholder="Numero" className="store-input" />
              <FieldError message={form.formState.errors.number?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("complement")} placeholder="Complemento" className="store-input" />
              <FieldError message={form.formState.errors.complement?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("neighborhood")} placeholder="Bairro" className="store-input" />
              <FieldError message={form.formState.errors.neighborhood?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("city")} placeholder="Cidade" className="store-input" />
              <FieldError message={form.formState.errors.city?.message} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Input {...form.register("state")} placeholder="UF" className="store-input" />
              <FieldError message={form.formState.errors.state?.message} />
            </div>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {shippingOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue("shippingMethod", option.value)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  shippingMethod === option.value
                    ? "border-brand-wine bg-brand-wine/10"
                    : "border-brand-black/10 bg-white/80 hover:border-brand-black/20",
                )}
              >
                <p className="font-medium text-brand-black">{option.title}</p>
                <p className="mt-2 text-sm leading-7 text-brand-charcoal">{option.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="store-panel space-y-5 p-6">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Pagamento</p>
            <h2 className="mt-3 font-heading text-4xl text-brand-black">Forma de pagamento</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {paymentOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => form.setValue("paymentMethod", option.value)}
                className={cn(
                  "rounded-2xl border p-4 text-left transition",
                  paymentMethod === option.value
                    ? "border-brand-wine bg-brand-wine/10"
                    : "border-brand-black/10 bg-white/80 hover:border-brand-black/20",
                )}
              >
                <p className="font-medium text-brand-black">{option.title}</p>
                <p className="mt-2 text-sm leading-7 text-brand-charcoal">{option.description}</p>
              </button>
            ))}
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Input {...form.register("couponCode")} placeholder="Cupom" className="store-input" />
              <FieldError message={form.formState.errors.couponCode?.message} />
            </div>
            <div className="space-y-2">
              <Input {...form.register("notes")} placeholder="Observacoes do pedido" className="store-input" />
              <FieldError message={form.formState.errors.notes?.message} />
            </div>
          </div>

          {session?.user ? (
            <label className="flex items-center gap-3 rounded-xl border border-brand-black/8 bg-white/70 px-4 py-3 text-sm text-brand-charcoal">
              <input type="checkbox" {...form.register("saveAddress")} className="size-4 accent-[#550d1a]" />
              Salvar este endereco na minha conta para compras futuras
            </label>
          ) : null}

          <Button
            type="submit"
            disabled={isPending}
            className="h-12 w-full rounded-lg bg-brand-wine text-white hover:bg-brand-wine/90 lg:hidden"
          >
            Confirmar pedido
          </Button>
        </section>
      </form>

      <aside className="space-y-5 lg:sticky lg:top-28 lg:self-start">
        <div className="store-panel h-fit space-y-5 p-6">
          <div>
            <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Resumo do pedido</p>
            <h3 className="mt-2 font-heading text-3xl text-brand-black">Compra segura</h3>
          </div>

          <div className="space-y-4">
            {items.map((item) => (
              <div key={item.variantId} className="flex items-center gap-3">
                <div className="relative size-16 overflow-hidden rounded-lg border border-brand-black/10 bg-[#ece6e1]">
                  <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="64px" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-brand-black">{item.productName}</p>
                  <p className="text-xs text-brand-warm-gray">
                    Tam. {item.sizeLabel} / Qtd. {item.quantity}
                  </p>
                </div>
                <p className="text-sm text-brand-black">{formatCurrency(item.unitPriceCents * item.quantity)}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3 border-t border-brand-black/8 pt-4 text-sm text-brand-charcoal">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="text-brand-black">{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Frete</span>
              <span className="text-brand-black">{formatCurrency(preview.shipping)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Desconto PIX</span>
              <span className="text-brand-black">-{formatCurrency(preview.pixDiscount)}</span>
            </div>
            <div className="flex items-center justify-between text-base font-semibold">
              <span className="text-brand-black">Total estimado</span>
              <span className="text-brand-black">{formatCurrency(preview.total)}</span>
            </div>
            {couponCode ? (
              <p className="text-xs uppercase tracking-[0.16em] text-brand-warm-gray">
                Cupom sera validado no servidor ao confirmar o pedido.
              </p>
            ) : null}
          </div>

          <Button
            type="submit"
            form="checkout-form"
            disabled={isPending}
            className="h-12 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal"
          >
            Confirmar pedido
          </Button>
        </div>

        <div className="store-panel-muted space-y-3 p-5">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-brand-wine" />
            <p className="text-sm leading-7 text-brand-charcoal">
              Autenticidade garantida, politicas claras e suporte ativo para reduzir abandono na etapa final.
            </p>
          </div>
          <div className="flex items-start gap-3">
            <ShoppingBag className="mt-0.5 size-5 text-brand-wine" />
            <p className="text-sm leading-7 text-brand-charcoal">
              PIX e cartao preparados para integracao real, com resumo visivel e menos distracoes no fluxo.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

export function WishlistView() {
  const items = useWishlistStore((state) => state.items);
  const removeItem = useWishlistStore((state) => state.removeItem);

  if (!items.length) {
    return (
      <EmptyState
        title="Sua wishlist esta vazia"
        description="Salve seus pares preferidos para comparar, voltar depois e comprar no melhor momento."
        actionLabel="Explorar catalogo"
        actionHref="/shop"
      />
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {items.map((item) => (
        <article key={item.id} className="store-panel overflow-hidden">
          <div className="relative aspect-[4/4.5] overflow-hidden bg-[#ece6e1]">
            <Image src={item.image} alt={item.name} fill className="object-cover" sizes="33vw" />
          </div>
          <div className="space-y-4 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-brand-warm-gray">{item.brand}</p>
              <h2 className="mt-2 font-heading text-3xl text-brand-black">{item.name}</h2>
              <p className="mt-2 text-sm text-brand-charcoal">{item.shortDescription}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-brand-black">
                {formatCurrency(item.salePriceInCents ?? item.basePriceInCents)}
              </span>
              <Button
                type="button"
                variant="ghost"
                className="text-brand-charcoal hover:text-brand-black"
                onClick={() => removeItem(item.id)}
              >
                <Heart className="mr-2 size-4 fill-current" />
                Remover
              </Button>
            </div>
            <Button asChild className="h-11 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
              <Link href={`/shop/${item.slug}`}>Ver produto</Link>
            </Button>
          </div>
        </article>
      ))}
    </div>
  );
}
