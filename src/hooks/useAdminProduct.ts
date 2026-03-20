import { useQuery } from '@apollo/client/react';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';
import type { ProductsFilters } from '@/types/filters';
import type { ProductSortField, SortOrder } from '@/types/productsSort';

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
  limit = ADMIN_PAGE_LIMIT,
  filters = {},
  search = '',
  sort = 'updatedAt',
  order = 'desc',
}: UseAdminProductsParams = {}) {
  // Normalize search input
  const normalizedSearch = search.trim();

  const filterInput = {
    ...(filters.status && { status: filters.status }),
    ...(filters.minPrice && { minPrice: parseFloat(filters.minPrice) }),
    ...(filters.maxPrice && { maxPrice: parseFloat(filters.maxPrice) }),
    ...(filters.categories?.length && { category: filters.categories }),
    ...(filters.dateFrom && { updatedFrom: new Date(filters.dateFrom) }),
    ...(filters.dateTo && {
      updatedTo: new Date(filters.dateTo + 'T23:59:59.999').toISOString(),
    }),
  };
  const hasFilters = Object.keys(filterInput).length > 0;

  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: {
      limit,
      page,
      search: normalizedSearch.length ? normalizedSearch : null,
      sort,
      order,
      filter: hasFilters ? filterInput : null,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const productsPage = data?.productsPage;
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
