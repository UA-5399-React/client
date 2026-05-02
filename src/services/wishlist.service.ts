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

  addToWishlist: (product: UserWishlistItem): Promise<UserResponse> =>
    apiClient.patch<UserResponse>('/users/me/wishlist', product),

  removeFromWishlist: (productId: string): Promise<UserResponse> =>
    apiClient.delete<UserResponse>(`/users/me/wishlist/${productId}`),

  clearFullWishlist: (): Promise<UserResponse> =>
    apiClient.delete<UserResponse>('/users/me/wishlist'),
};
