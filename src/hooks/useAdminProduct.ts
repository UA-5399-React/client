import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';

export function useAdminProducts(page = 1, limit = 10) {
  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: { limit, page },
  });

  const productsPage = data?.productsPage;
  const items = productsPage?.items ?? [];

  return {
    items,
    loading,
    error,
    totalPages: productsPage?.totalPages ?? 1,
    page: productsPage?.page ?? page,
  };
}
