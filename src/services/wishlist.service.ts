import { apiClient } from './api';

export interface UserWishlistItem {
  productId: string;
  title: string;
  price: number;
  image?: string;
}

export interface UserResponse {
  id: string;
  email: string;
  wishlist: UserWishlistItem[];
}

export const wishlistService = {
  getMe: (): Promise<UserResponse> => apiClient.get<UserResponse>('/users/me'),

  addToWishlist: (productId: string): Promise<UserResponse> =>
    apiClient.patch<UserResponse>('/users/me/wishlist', { productId }),

  removeFromWishlist: (productId: string): Promise<UserResponse> =>
    apiClient.delete<UserResponse>(`/users/me/wishlist/${productId}`),

  clearFullWishlist: (): Promise<UserResponse> =>
    apiClient.delete<UserResponse>('/users/me/wishlist'),
};
