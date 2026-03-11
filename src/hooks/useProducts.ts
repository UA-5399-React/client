import { useQuery } from '@tanstack/react-query';

import { productService } from '../services/productService';

export const useProducts = (
  page: number,
  limit: number,
  sort?: 'price' | 'title',
  search?: string,
) => {
  return useQuery({
    queryKey: ['products', page, limit, sort, search],
    queryFn: () => productService.getAll(page, limit, sort, search),
  });
};
