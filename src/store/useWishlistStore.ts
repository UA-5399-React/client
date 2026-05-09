import { create } from 'zustand';

import type { UserWishlistItem } from '@/services/wishlist.service';

type WishlistState = {
  items: UserWishlistItem[];
  setItems: (items: UserWishlistItem[]) => void;
  addItem: (item: UserWishlistItem) => void;
  removeItem: (productId: string) => void;
  clearItems: () => void;
};

export const useWishlistStore = create<WishlistState>((set) => ({
  items: [],

  setItems: (items) => set({ items }),

  addItem: (item) =>
    set((state) => {
      const alreadyExists = state.items.some(
        (wishlistItem) => wishlistItem.productId === item.productId,
      );

      if (alreadyExists) return state;

      return {
        items: [...state.items, item],
      };
    }),

  removeItem: (productId) =>
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    })),

  clearItems: () => set({ items: [] }),
}));
