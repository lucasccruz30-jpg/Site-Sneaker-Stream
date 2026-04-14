"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";

import { useCartStore } from "@/hooks/use-cart";
import { useWishlistStore } from "@/hooks/use-wishlist";

export function HeaderActions() {
  const cartCount = useCartStore((state) => state.itemCount());
  const wishlistCount = useWishlistStore((state) => state.items.length);

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/wishlist"
        className="relative inline-flex size-11 items-center justify-center rounded-lg border border-brand-black/10 bg-white/75 text-brand-black transition hover:border-brand-wine/20 hover:bg-white"
      >
        <Heart className="size-4" />
        {wishlistCount ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-md bg-brand-wine px-1.5 text-[0.65rem] font-semibold text-white">
            {wishlistCount}
          </span>
        ) : null}
      </Link>
      <Link
        href="/cart"
        className="relative inline-flex size-11 items-center justify-center rounded-lg border border-brand-black/10 bg-white/75 text-brand-black transition hover:border-brand-wine/20 hover:bg-white"
      >
        <ShoppingBag className="size-4" />
        {cartCount ? (
          <span className="absolute -right-1.5 -top-1.5 inline-flex min-w-5 items-center justify-center rounded-md bg-brand-wine px-1.5 text-[0.65rem] font-semibold text-white">
            {cartCount}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
