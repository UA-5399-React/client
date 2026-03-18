import { useQuery } from '@apollo/client/react';

import { GET_CATEGORIES_PAGE } from '@/services/graphql/categoryAdminService';
import type { CategoriesPageResult } from '@/types';

type UseAdminCategoriesPageParams = {
  page?: number;
  limit?: number;
  search?: string;
};

export function useAdminCategoriesPage({
  page = 1,
  limit = 10,
  search = '',
}: UseAdminCategoriesPageParams = {}) {
  const normalizedSearch = search.trim();

  const { data, loading, error } = useQuery<{
    categoriesPage: CategoriesPageResult;
  }>(GET_CATEGORIES_PAGE, {
    variables: {
      page,
      limit,
      search: normalizedSearch.length ? normalizedSearch : null,
    },
    fetchPolicy: 'cache-and-network',
    notifyOnNetworkStatusChange: true,
  });

  const categoriesPage = data?.categoriesPage;

  return {
    categories: categoriesPage?.items ?? [],
    loading,
    error,
    totalPages: categoriesPage?.totalPages ?? 1,
    page: categoriesPage?.page ?? page,
    total: categoriesPage?.total ?? 0,
  };
}
