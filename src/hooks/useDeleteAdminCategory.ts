import { useMutation } from '@apollo/client/react';

import {
  DELETE_CATEGORY,
  GET_CATEGORIES_LIST,
} from '@/services/graphql/categoryAdminService';

interface DeleteCategoryData {
  deleteCategory: {
    id: string;
  };
}

interface DeleteCategoryVariables {
  id: string;
}

export function useDeleteAdminCategory() {
  const [deleteCategoryMutation, { data, loading, error }] = useMutation<
    DeleteCategoryData,
    DeleteCategoryVariables
  >(DELETE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES_LIST }],
    awaitRefetchQueries: true,
  });

  const deleteCategory = async (id: string) => {
    return deleteCategoryMutation({
      variables: { id },
    });
  };

  return { deleteCategory, data, loading, error };
}
