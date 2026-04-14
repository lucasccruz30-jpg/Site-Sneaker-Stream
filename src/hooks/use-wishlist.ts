"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { ProductCardData } from "@/types";

type WishlistStore = {
  items: ProductCardData[];
  toggleItem: (item: ProductCardData) => void;
  hasItem: (productId: string) => boolean;
  removeItem: (productId: string) => void;
  clear: () => void;
};

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      toggleItem: (item) => {
        const exists = get().items.some((current) => current.id === item.id);
        set({
          items: exists
            ? get().items.filter((current) => current.id !== item.id)
            : [...get().items, item],
        });
      },
      hasItem: (productId) => get().items.some((item) => item.id === productId),
      removeItem: (productId) =>
        set({
          items: get().items.filter((item) => item.id !== productId),
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "sneaker-stream-wishlist",
    },
  ),
);
