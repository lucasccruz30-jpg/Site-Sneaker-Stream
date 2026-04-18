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
        "rounded-[0.3rem] border-brand-black/10 bg-white/88 text-brand-black shadow-[0_8px_20px_rgba(19,19,19,0.05)] hover:bg-white",
        hasItem && "border-brand-wine/40 bg-brand-wine/10 text-brand-wine",
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
