import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";

import { WishlistButton } from "@/components/store/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getDiscountPercentage, getInstallmentText, getStockStatus } from "@/lib/format";
import type { ProductCardData } from "@/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  const discountPercentage = getDiscountPercentage(product);
  const stockStatus = getStockStatus(product.totalStock);
  const badges = [
    product.isNewRelease ? "Novo" : null,
    product.isOnSale ? "Oferta" : null,
    product.isExclusive ? "Exclusivo" : null,
    stockStatus.label === "Pouco estoque" ? "Pouco estoque" : null,
  ].filter(Boolean);

  return (
    <article className="store-panel group relative overflow-hidden transition duration-500 hover:-translate-y-1">
      <div className="absolute right-4 top-4 z-10">
        <WishlistButton product={product} />
      </div>

      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.8] overflow-hidden border-b border-brand-black/8 bg-[#ece6e1]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 639px) 100vw, (max-width: 1279px) 50vw, 25vw"
          />

          <div className="absolute inset-x-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={badge}
                className="rounded-md border border-white/60 bg-white/88 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-brand-black shadow-none"
              >
                {badge}
              </Badge>
            ))}
            {discountPercentage > 0 ? (
              <Badge className="rounded-md border-none bg-brand-wine px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-white">
                -{discountPercentage}%
              </Badge>
            ) : null}
          </div>

          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between rounded-xl border border-white/60 bg-white/82 px-3 py-2 backdrop-blur">
            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-brand-warm-gray">{product.brand}</span>
            <span className="text-[0.68rem] uppercase tracking-[0.18em] text-brand-charcoal">{stockStatus.label}</span>
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-brand-warm-gray">
            <span>{product.category}</span>
            <span>{product.sizes.slice(0, 3).join(" / ")}</span>
          </div>

          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-heading text-[2rem] leading-none text-brand-black">{product.name}</h3>
          </Link>

          <p className="line-clamp-2 text-sm leading-7 text-brand-charcoal">{product.shortDescription}</p>
        </div>

        <div className="flex items-center gap-2 text-sm text-brand-charcoal">
          <div className="flex items-center gap-1 text-brand-wine">
            <Star className="size-4 fill-current" />
            <span className="font-medium text-brand-black">{product.ratingAverage.toFixed(1)}</span>
          </div>
          <span>{product.reviewCount} avaliacoes</span>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-brand-black">
              {formatCurrency(product.salePriceInCents ?? product.basePriceInCents)}
            </span>
            {product.salePriceInCents ? (
              <span className="text-sm text-brand-warm-gray line-through">{formatCurrency(product.basePriceInCents)}</span>
            ) : null}
          </div>
          <p className="text-sm text-brand-charcoal">
            {getInstallmentText(product.salePriceInCents ?? product.basePriceInCents)}
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-[1fr_auto]">
          <Button asChild className="h-11 rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
            <Link href={`/shop/${product.slug}`} className="inline-flex items-center justify-center gap-2">
              Ver produto
              <ArrowRight className="size-4" />
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-lg border-brand-black/10 bg-white/80 px-4 text-brand-black hover:bg-white"
          >
            <Link href={`/shop/${product.slug}`}>Ver numeracao</Link>
          </Button>
        </div>
      </div>
    </article>
  );
}

export function ProductGrid({ products }: { products: ProductCardData[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
