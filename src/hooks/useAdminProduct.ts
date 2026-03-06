import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';

type UseAdminProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export function useAdminProducts({
  page = 1,
  limit = 10,
  search = '',
}: UseAdminProductsParams = {}) {
  // Normalize search input
  const normalizedSearch = search.trim();

  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: {
      limit,
      page,
      // Send null instead of empty string
      search: normalizedSearch.length ? normalizedSearch : null,
    },
    // Allows UI to update loading state when variables change
    notifyOnNetworkStatusChange: true,
  });

  const productsPage = data?.productsPage;

  // Fallback to empty array if data is not loaded yet
  const items = productsPage?.items ?? [];

  return {
    items,
    loading,
    error,
    totalPages: productsPage?.totalPages ?? 1,
    page: productsPage?.page ?? page,
    total: productsPage?.total ?? 0,
  };
}
