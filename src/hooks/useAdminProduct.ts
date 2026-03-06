import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';
import type { ProductsFilters } from '@/types/filters';

import { matchCategory, matchDate, matchPrice, matchStatus } from './productsFilters';

interface UseAdminProductsOptions {
  page?: number;
  limit?: number;
  filters?: Partial<ProductsFilters>;
}

export function useAdminProducts(
  {page = 1,
  limit = 10,
  filters = {}}: UseAdminProductsOptions = {}
) {
  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: {
      limit,
      page,
    },
  });

  const productsPage = data?.productsPage;
  const allItems = productsPage?.items ?? [];

  const items = allItems.filter((product) => 
    matchCategory(product, filters.tags) &&
    matchPrice(product, filters) &&
    matchStatus(product, filters.status) &&
    matchDate(product, filters)
    );

  return {
    allItems,
    items,
    loading,
    error,
    totalPages: productsPage?.totalPages ?? 1,
    page: productsPage?.page ?? page,
  };
}
