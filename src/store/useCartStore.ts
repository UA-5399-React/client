import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import type { CartItem } from '@/types/cart.types';
import type { Product } from '@/types/product.types';

interface CartState {
  items: CartItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (product) => {
        set((state) => {
          const existingItem = state.items.find(
            (item) =>
              item.product.id === product.id ||
              item.product._id === product._id,
          );

          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.product.id === product.id ||
                item.product._id === product._id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item,
              ),
            };
          }

          return { items: [...state.items, { product, quantity: 1 }] };
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
    },
  ),
);
