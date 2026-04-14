"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { ShieldCheck, Truck } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/hooks/use-cart";
import { formatCurrency, getInstallmentText } from "@/lib/format";
import type { ProductDetailData } from "@/types";

import { WishlistButton } from "@/components/store/wishlist-button";
import { Button } from "@/components/ui/button";

export function ProductDetail({ product }: { product: ProductDetailData }) {
  const [selectedImage, setSelectedImage] = useState(product.gallery[0]?.url ?? product.image);
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants.find((variant) => variant.stock > 0)?.id ?? product.variants[0]?.id,
  );
  const variant = useMemo(
    () => product.variants.find((current) => current.id === selectedVariantId) ?? product.variants[0],
    [product.variants, selectedVariantId],
  );
  const addItem = useCartStore((state) => state.addItem);

  const currentPrice = product.salePriceInCents ?? product.basePriceInCents;

  return (
    <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-4">
        <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/5">
          <div className="relative aspect-square overflow-hidden bg-[#181818]">
            <Image
              src={selectedImage}
              alt={product.name}
              fill
              className="object-cover transition duration-500 hover:scale-110"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {product.gallery.map((image) => (
            <button
              key={image.id}
              type="button"
              onClick={() => setSelectedImage(image.url)}
              className={`relative aspect-square overflow-hidden rounded-[1.4rem] border ${
                selectedImage === image.url ? "border-brand-wine" : "border-white/10"
              } bg-white/5`}
            >
              <Image src={image.url} alt={image.alt} fill className="object-cover" sizes="20vw" />
            </button>
          ))}
        </div>
      </div>

      <div className="surface-panel h-fit space-y-8 p-7 sm:p-8 lg:sticky lg:top-28">
        <div className="space-y-3">
          <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-light-gray">
            {product.brand} • {product.category}
          </p>
          <h1 className="font-heading text-5xl text-white">{product.name}</h1>
          <p className="text-base leading-8 text-brand-light-gray">{product.shortDescription}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-3xl font-semibold text-white">{formatCurrency(currentPrice)}</span>
            {product.salePriceInCents ? (
              <span className="text-base text-brand-light-gray line-through">
                {formatCurrency(product.basePriceInCents)}
              </span>
            ) : null}
          </div>
          <p className="text-sm text-brand-light-gray">{getInstallmentText(currentPrice, product.installmentCount)}</p>
          <p className="text-sm text-brand-light-gray">
            No PIX: {formatCurrency(Math.round(currentPrice * 0.95))} com confirmação rápida
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-white">Escolha sua numeração</p>
            <p className="text-sm text-brand-light-gray">Guia de tamanhos</p>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {product.variants.map((sizeVariant) => (
              <button
                key={sizeVariant.id}
                type="button"
                disabled={sizeVariant.stock <= 0}
                onClick={() => setSelectedVariantId(sizeVariant.id)}
                className={`rounded-2xl border px-3 py-4 text-sm font-medium transition ${
                  selectedVariantId === sizeVariant.id
                    ? "border-brand-wine bg-brand-wine/20 text-white"
                    : "border-white/10 bg-white/5 text-brand-light-gray"
                } ${sizeVariant.stock <= 0 ? "cursor-not-allowed opacity-40" : "hover:border-brand-light-gray/30 hover:text-white"}`}
              >
                {sizeVariant.sizeLabel}
              </button>
            ))}
          </div>
          {variant?.stock && variant.stock <= 3 ? (
            <p className="text-sm text-amber-200">Restam apenas {variant.stock} unidades nesta numeração.</p>
          ) : null}
        </div>

        <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
          <Button
            size="lg"
            className="h-12 rounded-full bg-brand-wine text-white hover:bg-brand-wine/90"
            disabled={!variant || variant.stock <= 0}
            onClick={() => {
              if (!variant) {
                return;
              }

              addItem({
                productId: product.id,
                variantId: variant.id,
                productName: product.name,
                productSlug: product.slug,
                brand: product.brand,
                imageUrl: product.image,
                sizeLabel: variant.sizeLabel,
                quantity: 1,
                unitPriceCents: currentPrice,
                compareAtPriceCents: product.salePriceInCents ? product.basePriceInCents : null,
                maxStock: variant.stock,
              });
              toast.success("Produto adicionado ao carrinho.");
            }}
          >
            Adicionar ao carrinho
          </Button>
          <WishlistButton product={product} className="size-12 rounded-full" />
        </div>

        <Button asChild size="lg" variant="outline" className="h-12 w-full rounded-full border-white/10 bg-white/5 text-white hover:bg-white/10">
          <Link href="/checkout">Comprar agora</Link>
        </Button>

        <div className="grid gap-3">
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-start gap-3">
              <ShieldCheck className="mt-0.5 size-5 text-brand-off-white" />
              <div>
                <p className="font-medium text-white">Autenticidade garantida</p>
                <p className="mt-1 text-sm leading-7 text-brand-light-gray">
                  Conferência interna antes do envio e suporte rápido em caso de dúvida.
                </p>
              </div>
            </div>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
            <div className="flex items-start gap-3">
              <Truck className="mt-0.5 size-5 text-brand-off-white" />
              <div>
                <p className="font-medium text-white">Prazo estimado de entrega</p>
                <p className="mt-1 text-sm leading-7 text-brand-light-gray">
                  Despacho em até {product.leadTimeInBusinessDays} dias úteis com rastreio seguro.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-2 border-t border-white/8 pt-6 text-sm text-brand-light-gray">
          {product.highlights.map((item) => (
            <div key={item} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-brand-wine" />
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
