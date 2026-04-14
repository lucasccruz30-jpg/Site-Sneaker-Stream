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
        className="relative inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-brand-light-gray/40 hover:bg-white/10"
      >
        <Heart className="size-4" />
        {wishlistCount ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-wine px-1.5 text-[0.65rem] font-semibold text-white">
            {wishlistCount}
          </span>
        ) : null}
      </Link>
      <Link
        href="/cart"
        className="relative inline-flex size-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition hover:border-brand-light-gray/40 hover:bg-white/10"
      >
        <ShoppingBag className="size-4" />
        {cartCount ? (
          <span className="absolute -right-1 -top-1 inline-flex min-w-5 items-center justify-center rounded-full bg-brand-wine px-1.5 text-[0.65rem] font-semibold text-white">
            {cartCount}
          </span>
        ) : null}
      </Link>
    </div>
  );
}
