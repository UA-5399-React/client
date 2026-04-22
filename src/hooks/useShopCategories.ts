import { useQuery } from '@tanstack/react-query';

import { categoryService } from '@/services/categoryService';

export function useShopCategories() {
  return useQuery({
    queryKey: ['shop-categories'],
    queryFn: () => categoryService.getPublicCategories(),
    staleTime: 5 * 60 * 1000,
    refetchOnMount: false,
  });
}
