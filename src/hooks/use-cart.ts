"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartLineItem } from "@/types";

type CartStore = {
  items: CartLineItem[];
  addItem: (item: CartLineItem) => void;
  removeItem: (variantId: string) => void;
  updateQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: () => number;
  subtotal: () => number;
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const existing = get().items.find((current) => current.variantId === item.variantId);

        if (existing) {
          set({
            items: get().items.map((current) =>
              current.variantId === item.variantId
                ? {
                    ...current,
                    quantity: Math.min(current.quantity + item.quantity, current.maxStock),
                  }
                : current,
            ),
          });
          return;
        }

        set({
          items: [...get().items, item],
        });
      },
      removeItem: (variantId) => {
        set({
          items: get().items.filter((item) => item.variantId !== variantId),
        });
      },
      updateQuantity: (variantId, quantity) => {
        set({
          items: get().items.map((item) =>
            item.variantId === variantId
              ? {
                  ...item,
                  quantity: Math.max(1, Math.min(quantity, item.maxStock)),
                }
              : item,
          ),
        });
      },
      clearCart: () => set({ items: [] }),
      itemCount: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: () => get().items.reduce((sum, item) => sum + item.unitPriceCents * item.quantity, 0),
    }),
    {
      name: "sneaker-stream-cart",
    },
  ),
);
