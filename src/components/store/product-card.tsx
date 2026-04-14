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
    <article className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 transition duration-500 hover:-translate-y-1 hover:border-brand-light-gray/30 hover:bg-white/7">
      <div className="absolute right-4 top-4 z-10">
        <WishlistButton product={product} />
      </div>
      <Link href={`/shop/${product.slug}`} className="block">
        <div className="relative aspect-[4/4.7] overflow-hidden bg-[#1B1B1B]">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-700 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111111] to-transparent" />
          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
            {badges.map((badge) => (
              <Badge key={badge} className="rounded-full border-none bg-black/55 px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white backdrop-blur">
                {badge}
              </Badge>
            ))}
            {discountPercentage > 0 ? (
              <Badge className="rounded-full border-none bg-brand-wine px-3 py-1 text-[0.65rem] uppercase tracking-[0.18em] text-white">
                -{discountPercentage}%
              </Badge>
            ) : null}
          </div>
        </div>
      </Link>
      <div className="space-y-4 p-5">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-3 text-[0.7rem] uppercase tracking-[0.22em] text-brand-light-gray">
            <span>{product.brand}</span>
            <span>{product.category}</span>
          </div>
          <Link href={`/shop/${product.slug}`} className="block">
            <h3 className="font-heading text-3xl text-white">{product.name}</h3>
          </Link>
          <p className="line-clamp-2 text-sm leading-7 text-brand-light-gray">{product.shortDescription}</p>
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <span className="text-xl font-semibold text-white">
              {formatCurrency(product.salePriceInCents ?? product.basePriceInCents)}
            </span>
            {product.salePriceInCents ? (
              <span className="text-sm text-brand-light-gray line-through">{formatCurrency(product.basePriceInCents)}</span>
            ) : null}
          </div>
          <p className="text-sm text-brand-light-gray">
            {getInstallmentText(product.salePriceInCents ?? product.basePriceInCents)}
          </p>
        </div>

        <Button asChild className="h-11 w-full rounded-full bg-white text-brand-black hover:bg-brand-off-white">
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
