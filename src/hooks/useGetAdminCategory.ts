import { useQuery } from '@apollo/client/react';

import { GET_CATEGORY } from '@/services/graphql/categoryAdminService';
import type { Category } from '@/types';

interface GetCategoryData {
  category: Category;
}

export function useGetAdminCategory(id?: string) {
  const { data, loading, error } = useQuery<GetCategoryData>(GET_CATEGORY, {
    variables: { id },
    skip: !id,
  });

  return {
    category: data?.category,
    loading,
    error,
  };
}
