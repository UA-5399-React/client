import type { Product } from '../types';
import { apiClient } from './api';

export interface PaginatedResponse<T> {
  items: T[];
  totalPages: number;
}

export const productService = {
  getAll: (page: number, limit: number): Promise<PaginatedResponse<Product>> =>
    apiClient
      .get<PaginatedResponse<Product>>(`/products?page=${page}&limit=${limit}`)
      .then((res) => res),
};
