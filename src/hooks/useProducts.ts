import { useQuery } from '@tanstack/react-query';

import { productService } from '../services/productService';

export const useProducts = (
  page: number,
  limit: number,
  sort?: 'price' | 'title',
) => {
  return useQuery({
    queryKey: ['products', page, limit, sort],
    queryFn: () => productService.getAll(page, limit, sort),
  });
};
