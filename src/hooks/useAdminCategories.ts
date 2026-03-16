import { useQuery } from '@apollo/client/react';

import { GET_CATEGORIES_LIST } from '@/services/graphql/categoryAdminService';
import type { Category } from '@/types';

interface GetCategoriesListData {
  categoriesList: Category[];
}

export function useAdminCategories() {
  const { data, loading, error } = useQuery<GetCategoriesListData>(
    GET_CATEGORIES_LIST,
    {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    },
  );

  return {
    categories: data?.categoriesList ?? [],
    loading,
    error,
  };
}
