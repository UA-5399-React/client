import type { Product } from '../types';
import { apiClient } from './api';

export const productService = {
  getAll: (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products');
  },
};
