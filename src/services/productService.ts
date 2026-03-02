import { apiClient } from './api';
import type { Product } from '../types';

export const productService = {
  getAll: (): Promise<Product[]> => {
    return apiClient.get<Product[]>('/products');
  },
};
