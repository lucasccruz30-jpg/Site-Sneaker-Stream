import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { WishlistButton } from "@/components/store/wishlist-button";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, getDiscountPercentage, getInstallmentText } from "@/lib/format";
import type { ProductCardData } from "@/types";

export function ProductCard({ product }: { product: ProductCardData }) {
  const discountPercentage = getDiscountPercentage(product);
  const badges = [
    product.isNewRelease ? "Novo" : null,
    product.isOnSale ? "Oferta" : null,
    product.isExclusive ? "Exclusivo" : null,
    product.totalStock > 0 && product.totalStock <= 4 ? "Pouco estoque" : null,
  ].filter(Boolean);

  return (
    <article className="store-panel group relative overflow-hidden transition duration-500 hover:-translate-y-1">
      <div className="absolute right-4 top-4 z-10">
        <WishlistButton product={product} />
      </div>
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.7] overflow-hidden border-b border-brand-black/8 bg-[#ece6e1]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge
                key={badge}
                className="rounded-md border border-white/60 bg-white/80 px-3 py-1 text-[0.65rem] uppercase tracking-[0.16em] text-brand-black shadow-none"
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
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-[0.68rem] uppercase tracking-[0.18em] text-brand-warm-gray">
            <span>{product.brand}</span>
            <span>{product.category}</span>
          </div>
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-heading text-3xl text-brand-black">{product.name}</h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-7 text-brand-charcoal">{product.shortDescription}</p>
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
          <p className="text-sm text-brand-charcoal">{getInstallmentText(product.salePriceInCents ?? product.basePriceInCents)}</p>
        </div>

        <Button asChild className="h-11 w-full rounded-lg bg-brand-black text-white hover:bg-brand-charcoal">
          <Link href={`/shop/${product.slug}`} className="inline-flex items-center justify-center gap-2">
            Ver produto
            <ArrowRight className="size-4" />
          </Link>
        </Button>
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
