import type { Product } from '../types';
import { apiClient } from './api';

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
}

export const productService = {
  getAll: (
    page: number,
    limit: number,
    sort?: 'price' | 'title',
    search?: string,
    category?: string,
    minPrice?: string,
    maxPrice?: string,
  ): Promise<PaginatedResponse<Product>> =>
    apiClient
      .get<
        PaginatedResponse<Product>
      >(`/products?page=${page}&limit=${limit}${sort ? `&sort=${sort}` : ''}${search ? `&search=${search}` : ''}${category ? `&category=${category}` : ''}${minPrice ? `&minPrice=${minPrice}` : ''}${maxPrice ? `&maxPrice=${maxPrice}` : ''}`)
      .then((res) => res),
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response;
  },
};
