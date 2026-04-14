"use client";

import { Heart } from "lucide-react";
import { toast } from "sonner";

import { useWishlistStore } from "@/hooks/use-wishlist";
import { cn } from "@/lib/utils";
import type { ProductCardData } from "@/types";

import { Button } from "@/components/ui/button";

export function WishlistButton({
  product,
  className,
}: {
  product: ProductCardData;
  className?: string;
}) {
  const hasItem = useWishlistStore((state) => state.hasItem(product.id));
  const toggleItem = useWishlistStore((state) => state.toggleItem);

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className={cn(
        "border-white/10 bg-black/35 text-white backdrop-blur hover:bg-white/10",
        hasItem && "border-brand-wine/60 bg-brand-wine/20 text-brand-off-white",
        className,
      )}
      onClick={() => {
        toggleItem(product);
        toast.success(hasItem ? "Removido da wishlist." : "Adicionado aos favoritos.");
      }}
    >
      <Heart className={cn("size-4", hasItem && "fill-current")} />
    </Button>
  );
}
