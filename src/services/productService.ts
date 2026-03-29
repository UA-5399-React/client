import type { Product } from '../types';
import { apiClient } from './api';

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
}

const normalizePriceParam = (value?: string) => {
  const trimmedValue = value?.trim();
  return trimmedValue ? trimmedValue : undefined;
};

export const productService = {
  getAll: (
    page: number,
    limit: number,
    sort?: 'price' | 'title' | 'createdAt',
    search?: string,
    category?: string[],
    minPrice?: string,
    maxPrice?: string,
  ): Promise<PaginatedResponse<Product>> =>
    apiClient.get<PaginatedResponse<Product>>('/products', {
      params: {
        page,
        limit,
        sort,
        search,
        category: category?.length ? category : undefined,
        minPrice: normalizePriceParam(minPrice),
        maxPrice: normalizePriceParam(maxPrice),
      },
    }),
  getById: async (id: string): Promise<Product> => {
    const response = await apiClient.get<Product>(`/products/${id}`);
    return response;
  },
};
