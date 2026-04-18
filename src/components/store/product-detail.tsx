"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, CreditCard, RefreshCcw, ShieldCheck, Star, Truck } from "lucide-react";
import { toast } from "sonner";

import { useCartStore } from "@/hooks/use-cart";
import { formatCurrency, getDiscountPercentage, getInstallmentText, getStockStatus } from "@/lib/format";
import type { ProductDetailData, SiteSettingsData } from "@/types";

import { WishlistButton } from "@/components/store/wishlist-button";
import { Button } from "@/components/ui/button";

const sizeGuideTips = [
  "A numeracao segue o padrao BR informado no seletor.",
  "Se voce usa o modelo pela primeira vez, compare com um par de referencia do seu armario.",
  "Em caso de duvida, nossa equipe ajuda antes da compra para reduzir trocas desnecessarias.",
];

export function ProductDetail({
  product,
  settings,
}: {
  product: ProductDetailData;
  settings: SiteSettingsData;
}) {
  const router = useRouter();
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
  const pixPrice = Math.round(currentPrice * (1 - settings.pixDiscountPercentage / 100));
  const discountPercentage = getDiscountPercentage(product);
  const stockStatus = getStockStatus(product.totalStock);

  function persistCartItem() {
    if (!variant) {
      toast.error("Selecione uma numeracao para continuar.");
      return false;
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

    return true;
  }

  function handleAddToCart() {
    if (!persistCartItem()) {
      return;
    }

    toast.success("Produto adicionado ao carrinho.");
  }

  function handleBuyNow() {
    if (!persistCartItem()) {
      return;
    }

    toast.success("Produto adicionado. Voce ja pode finalizar a compra.");
    router.push("/checkout");
  }

  return (
    <div className="space-y-6 pb-24 lg:pb-0">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-4">
          <div className="store-panel overflow-hidden p-3">
            <div className="relative aspect-square overflow-hidden rounded-[0.35rem] bg-[#ece6e1]">
              <Image
                src={selectedImage}
                alt={product.name}
                fill
                className="object-cover transition duration-500 hover:scale-105"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute left-4 top-4 rounded-[0.22rem] border border-white/70 bg-white/92 px-3 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-brand-black">
                Visual premium
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {product.gallery.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => setSelectedImage(image.url)}
                className={`relative aspect-square overflow-hidden rounded-[0.3rem] border ${
                  selectedImage === image.url ? "border-brand-wine" : "border-brand-black/10"
                } bg-white`}
              >
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 22vw, 120px"
                />
              </button>
            ))}
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="store-panel-muted p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Guia rapido de tamanho</p>
              <div className="mt-4 space-y-3">
                {sizeGuideTips.map((tip) => (
                  <div key={tip} className="flex items-start gap-2 text-sm leading-7 text-brand-charcoal">
                    <CheckCircle2 className="mt-1 size-4 text-brand-wine" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="store-panel-muted p-5">
              <p className="text-[0.68rem] uppercase tracking-[0.22em] text-brand-warm-gray">Entrega e suporte</p>
              <div className="mt-4 space-y-3 text-sm leading-7 text-brand-charcoal">
                <p>Despacho em ate {product.leadTimeInBusinessDays} dias uteis com rastreio seguro.</p>
                <p>
                  {settings.freeShippingThresholdCents
                    ? `Frete gratis acima de ${formatCurrency(settings.freeShippingThresholdCents)}.`
                    : settings.shippingLeadText}
                </p>
                <p>Se bater duvida, nossa equipe ajuda antes da compra para evitar erro de numeracao.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
          <div className="store-panel space-y-7 p-7 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              {product.isExclusive ? (
                <span className="rounded-[0.22rem] bg-brand-wine px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-white">
                  Exclusivo
                </span>
              ) : null}
              {product.isNewRelease ? (
                <span className="rounded-[0.22rem] border border-brand-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-black">
                  Lancamento
                </span>
              ) : null}
              {discountPercentage > 0 ? (
                <span className="rounded-[0.22rem] border border-brand-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-black">
                  {discountPercentage}% off
                </span>
              ) : null}
              <span className="rounded-[0.22rem] border border-brand-black/10 bg-white px-3 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-brand-black">
                {stockStatus.label}
              </span>
            </div>

            <div className="space-y-3">
              <p className="text-[0.72rem] uppercase tracking-[0.28em] text-brand-warm-gray">
                {product.brand} / {product.category}
              </p>
              <h1 className="font-heading text-5xl leading-none text-brand-black">{product.name}</h1>
              <p className="text-base leading-8 text-brand-charcoal">{product.shortDescription}</p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-brand-charcoal">
              <div className="flex items-center gap-1 text-brand-wine">
                <Star className="size-4 fill-current" />
                <span className="font-medium text-brand-black">{product.ratingAverage.toFixed(1)}</span>
              </div>
              <span>{product.reviewCount} avaliacoes verificadas</span>
              <span>{product.totalStock} unidades no estoque total</span>
            </div>

            <div className="rounded-[0.4rem] border border-brand-black/10 bg-[#f8f4ef] p-5">
              <div className="flex flex-wrap items-end gap-3">
                <span className="text-4xl font-semibold text-brand-black">{formatCurrency(currentPrice)}</span>
                {product.salePriceInCents ? (
                  <span className="pb-1 text-base text-brand-warm-gray line-through">
                    {formatCurrency(product.basePriceInCents)}
                  </span>
                ) : null}
              </div>
              <p className="mt-3 text-sm text-brand-charcoal">{getInstallmentText(currentPrice, product.installmentCount)}</p>
              <p className="mt-1 text-sm text-brand-charcoal">
                No PIX: <span className="font-medium text-brand-black">{formatCurrency(pixPrice)}</span> com confirmacao rapida
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm font-medium text-brand-black">Escolha sua numeracao</p>
                <p className="text-sm text-brand-warm-gray">Guia rapido logo abaixo da galeria</p>
              </div>
              <div className="grid grid-cols-4 gap-3 sm:grid-cols-5">
                {product.variants.map((sizeVariant) => (
                  <button
                    key={sizeVariant.id}
                    type="button"
                    disabled={sizeVariant.stock <= 0}
                    onClick={() => setSelectedVariantId(sizeVariant.id)}
                    className={`rounded-[0.3rem] border px-3 py-3 text-sm font-medium transition ${
                      selectedVariantId === sizeVariant.id
                        ? "border-brand-wine bg-brand-wine/10 text-brand-black"
                        : "border-brand-black/10 bg-white text-brand-charcoal"
                    } ${sizeVariant.stock <= 0 ? "cursor-not-allowed opacity-35" : "hover:border-brand-black/20 hover:text-brand-black"}`}
                  >
                    <span className="block">{sizeVariant.sizeLabel}</span>
                    <span className="mt-1 block text-[0.68rem] font-normal uppercase tracking-[0.14em] text-brand-warm-gray">
                      {sizeVariant.stock > 0 ? `${sizeVariant.stock} un.` : "Esgotado"}
                    </span>
                  </button>
                ))}
              </div>
              {variant?.stock && variant.stock <= 3 ? (
                <p className="text-sm text-brand-wine">Restam apenas {variant.stock} unidades nesta numeracao.</p>
              ) : null}
            </div>

            <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
              <Button
                size="lg"
                className="h-12 rounded-[0.3rem] bg-brand-wine text-white hover:bg-brand-wine/90"
                disabled={!variant || variant.stock <= 0}
                onClick={handleBuyNow}
              >
                Comprar agora
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-12 rounded-[0.3rem] border-brand-black/10 bg-white/80 text-brand-black hover:bg-white"
                disabled={!variant || variant.stock <= 0}
                onClick={handleAddToCart}
              >
                Adicionar ao carrinho
              </Button>
              <WishlistButton product={product} className="size-12 rounded-[0.3rem]" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="store-panel-muted p-4">
                <ShieldCheck className="size-5 text-brand-wine" />
                <p className="mt-3 text-sm font-medium text-brand-black">Autenticidade</p>
                <p className="mt-1 text-sm leading-7 text-brand-charcoal">Processo interno de conferencia antes do envio.</p>
              </div>
              <div className="store-panel-muted p-4">
                <Truck className="size-5 text-brand-wine" />
                <p className="mt-3 text-sm font-medium text-brand-black">Entrega</p>
                <p className="mt-1 text-sm leading-7 text-brand-charcoal">Despacho em ate {product.leadTimeInBusinessDays} dias uteis.</p>
              </div>
              <div className="store-panel-muted p-4">
                <RefreshCcw className="size-5 text-brand-wine" />
                <p className="mt-3 text-sm font-medium text-brand-black">Troca facilitada</p>
                <p className="mt-1 text-sm leading-7 text-brand-charcoal">Politica clara para reduzir inseguranca na compra.</p>
              </div>
            </div>

            <div className="grid gap-2 border-t border-brand-black/8 pt-6 text-sm text-brand-charcoal">
              {product.highlights.map((item) => (
                <div key={item} className="flex items-start gap-2">
                  <span className="mt-2 size-1.5 rounded-full bg-brand-wine" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="store-panel-dark space-y-5 p-6">
            <div className="flex items-center gap-2 text-brand-light-gray">
              <CreditCard className="size-4" />
              <p className="text-[0.72rem] uppercase tracking-[0.22em]">Compra segura</p>
            </div>
            <div className="space-y-3 text-sm leading-7 text-brand-light-gray">
              <p>{settings.authenticityMessage}</p>
              <p>{settings.shippingLeadText}</p>
              <p>Checkout com destaque para PIX e estrutura pronta para cartao.</p>
            </div>
            <Button
              asChild
              variant="outline"
              className="h-11 rounded-[0.3rem] border-white/12 bg-white/6 text-white hover:bg-white/10"
            >
              <Link href="/politica-de-troca-e-devolucao">Ver politica de troca e devolucao</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-brand-black/10 bg-[rgba(250,247,243,0.96)] p-4 backdrop-blur lg:hidden">
        <div className="mx-auto flex max-w-[1440px] items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-brand-black">{product.name}</p>
            <p className="text-sm text-brand-charcoal">
              {variant ? `Tam. ${variant.sizeLabel}` : "Selecione a numeracao"} • {formatCurrency(currentPrice)}
            </p>
          </div>
          <Button
            className="h-12 rounded-[0.3rem] bg-brand-wine px-5 text-white hover:bg-brand-wine/90"
            disabled={!variant || variant.stock <= 0}
            onClick={handleBuyNow}
          >
            Comprar
          </Button>
        </div>
      </div>
    </div>
  );
}
