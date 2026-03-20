import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem } from '@/types/cart.types';
import type { Product } from '@/types/product.types';

interface CartState {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      addItem: (product, quantity = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => {
            const matchId =
              product.id !== undefined && item.product.id === product.id;
            const match_id =
              product._id !== undefined && item.product._id === product._id;
            return matchId || match_id;
          });

          if (existingItem) {
            return {
              items: state.items.map((item) => {
                const matchId =
                  product.id !== undefined && item.product.id === product.id;
                const match_id =
                  product._id !== undefined && item.product._id === product._id;
                return matchId || match_id
                  ? { ...item, quantity: item.quantity + quantity }
                  : item;
              }),
              isOpen: true,
            };
          }

          return {
            items: [...state.items, { product, quantity }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              item.product.id !== productId && item.product._id !== productId,
          ),
        }));
      },

      updateQuantity: (productId, quantity) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId || item.product._id === productId
              ? { ...item, quantity: Math.max(1, quantity) }
              : item,
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getCartTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0,
        );
      },
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ items: state.items }),
    },
  ),
);
