import type { Product } from '../types';
import { apiClient } from './api';

export const productService = {
  getAll: (): Promise<Product[]> =>
    apiClient
      .get<{ items: Product[] }>('/products?page=1&limit=10')
      .then((res) => res.items),
};
