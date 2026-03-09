import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';
import type { ProductsFilters } from '@/types/filters';
import type { ProductSortField, SortOrder } from '@/types/productsSort';

import {
  matchCategory,
  matchDate,
  matchPrice,
  matchStatus,
} from '../utils/productsFilters';

type UseAdminProductsParams = {
  page?: number;
  limit?: number;
  search?: string;
  filters?: Partial<ProductsFilters>;
  sort?: ProductSortField;
  order?: SortOrder;
};

export function useAdminProducts({
  page = 1,
  limit = 10,
  filters = {},
  search = '',
  sort = 'updatedAt',
  order = 'desc',
}: UseAdminProductsParams = {}) {
  // Normalize search input
  const normalizedSearch = search.trim();

  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: {
      limit,
      page,
      search: normalizedSearch.length ? normalizedSearch : null,
      sort,
      order,
    },
    notifyOnNetworkStatusChange: true,
  });

  const productsPage = data?.productsPage;
  const allItems = productsPage?.items ?? [];

  const items = allItems.filter(
    (product) =>
      matchCategory(product, filters.tags) &&
      matchPrice(product, filters) &&
      matchStatus(product, filters.status) &&
      matchDate(product, filters),
  );

  return {
    allItems,
    items,
    loading,
    error,
    totalPages: productsPage?.totalPages ?? 1,
    page: productsPage?.page ?? page,
    total: productsPage?.total ?? 0,
  };
}
