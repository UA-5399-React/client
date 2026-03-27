import { apiClient } from '@/services/api';
import type { CartResponse } from '@/types/cart.types';

export const cartService = {
  syncCart: async (
    items: { productId: string; quantity: number }[],
  ): Promise<CartResponse> => {
    return apiClient.post<CartResponse>(`/cart/sync`, { items });
  },

  updateCart: async (
    items: { productId: string; quantity: number }[],
  ): Promise<CartResponse> => {
    return apiClient.post<CartResponse>(`/cart`, { items });
  },

  getCart: async (): Promise<CartResponse> => {
    return apiClient.get<CartResponse>(`/cart`);
  },
};
