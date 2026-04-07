import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { productService } from '../services/productService';

export const useProducts = (
  page: number,
  limit: number,
  sort?: 'price' | 'title' | 'createdAt',
  search?: string,
  category?: string[],
  minPrice?: string,
  maxPrice?: string,
) => {
  return useQuery({
    queryKey: [
      'products',
      page,
      limit,
      sort,
      search,
      category,
      minPrice,
      maxPrice,
    ],
    queryFn: () =>
      productService.getAll(
        page,
        limit,
        sort,
        search,
        category,
        minPrice,
        maxPrice,
      ),
    placeholderData: keepPreviousData,
  });
};
