"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Heart, Minus, Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/hooks/use-cart";
import { useWishlistStore } from "@/hooks/use-wishlist";
import { formatCurrency } from "@/lib/format";
import { checkoutSchema } from "@/lib/validators/store";
import { createOrderAction } from "@/server/actions/store";
import type { CartLineItem } from "@/types";

import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const checkoutFormSchema = checkoutSchema.omit({ items: true });

function CartSummary({ items }: { items: CartLineItem[] }) {
  const subtotal = items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0);

  return (
    <div className="store-panel h-fit space-y-5 p-6 lg:sticky lg:top-28">
      <div>
        <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Resumo</p>
        <h2 className="mt-3 font-heading text-3xl text-brand-black">Seu pedido</h2>
      </div>
      <div className="space-y-3 text-sm text-brand-charcoal">
        <div className="flex items-center justify-between">
          <span>Subtotal</span>
          <span className="text-brand-black">{formatCurrency(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Frete</span>
          <span className="text-brand-black">Calculado no checkout</span>
        </div>
      </div>
      <Button asChild className="h-12 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
        <Link href="/checkout">Ir para o checkout</Link>
      </Button>
    </div>
  );
}

export function CartView() {
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
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-4">
        {items.map((item) => (
          <article key={item.variantId} className="store-panel grid gap-5 p-5 sm:grid-cols-[140px_1fr]">
            <div className="relative aspect-square overflow-hidden rounded-lg border border-brand-black/10 bg-[#ece6e1]">
              <Image src={item.imageUrl} alt={item.productName} fill className="object-cover" sizes="160px" />
            </div>
            <div className="flex flex-col gap-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-brand-warm-gray">{item.brand}</p>
                  <h3 className="mt-2 font-heading text-3xl text-brand-black">{item.productName}</h3>
                  <p className="mt-2 text-sm text-brand-charcoal">Numeracao {item.sizeLabel}</p>
                </div>
                <Button type="button" variant="outline" size="icon" className="border-brand-black/10 bg-white text-brand-black hover:bg-white" onClick={() => removeItem(item.variantId)}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-2 rounded-lg border border-brand-black/10 bg-white p-1">
                  <Button type="button" variant="ghost" size="icon" className="rounded-md text-brand-black hover:bg-black/5" onClick={() => updateQuantity(item.variantId, item.quantity - 1)}>
                    <Minus className="size-4" />
                  </Button>
                  <span className="min-w-8 text-center text-brand-black">{item.quantity}</span>
                  <Button type="button" variant="ghost" size="icon" className="rounded-md text-brand-black hover:bg-black/5" onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>
                    <Plus className="size-4" />
                  </Button>
                </div>
                <div className="text-right">
                  <p className="text-sm text-brand-charcoal">Total do item</p>
                  <p className="text-xl font-semibold text-brand-black">{formatCurrency(item.unitPriceCents * item.quantity)}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
      <CartSummary items={items} />
    </div>
  );
}

export function CheckoutView() {
  const router = useRouter();
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
      couponCode: "",
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
    <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
      <form
        className="store-panel space-y-5 p-6"
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
        <div>
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">Checkout</p>
          <h2 className="mt-3 font-heading text-4xl text-brand-black">Finalize em poucos cliques</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input {...form.register("name")} placeholder="Nome completo" className="store-input" />
          <Input {...form.register("email")} type="email" placeholder="E-mail" className="store-input" />
          <Input {...form.register("phone")} placeholder="Telefone" className="store-input" />
          <Input {...form.register("zipCode")} placeholder="CEP" className="store-input" />
          <Input {...form.register("street")} placeholder="Rua" className="store-input md:col-span-2" />
          <Input {...form.register("number")} placeholder="Numero" className="store-input" />
          <Input {...form.register("complement")} placeholder="Complemento" className="store-input" />
          <Input {...form.register("neighborhood")} placeholder="Bairro" className="store-input" />
          <Input {...form.register("city")} placeholder="Cidade" className="store-input" />
          <Input {...form.register("state")} placeholder="UF" className="store-input" />
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <select {...form.register("paymentMethod")} className="store-select">
            <option value="PIX">PIX</option>
            <option value="CARD">Cartao</option>
          </select>
          <select {...form.register("shippingMethod")} className="store-select">
            <option value="standard">Frete padrao</option>
            <option value="express">Frete expresso</option>
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          <Input {...form.register("couponCode")} placeholder="Cupom" className="store-input" />
          <Input {...form.register("notes")} placeholder="Observacoes do pedido" className="store-input" />
        </div>
        <Button type="submit" disabled={isPending} className="h-12 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
          Confirmar pedido
        </Button>
      </form>

      <aside className="store-panel h-fit space-y-5 p-6 lg:sticky lg:top-28">
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
                <p className="text-xs text-brand-warm-gray">Tam. {item.sizeLabel} / Qtd. {item.quantity}</p>
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
            <span className="text-brand-black">Calculado no servidor</span>
          </div>
          <div className="flex items-center justify-between text-base font-semibold">
            <span className="text-brand-black">Total estimado</span>
            <span className="text-brand-black">{formatCurrency(subtotal)}</span>
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
              <span className="text-lg font-semibold text-brand-black">{formatCurrency(item.salePriceInCents ?? item.basePriceInCents)}</span>
              <Button type="button" variant="ghost" className="text-brand-charcoal hover:text-brand-black" onClick={() => removeItem(item.id)}>
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
