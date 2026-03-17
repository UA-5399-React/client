import { useMutation } from '@apollo/client/react';

import {
  GET_CATEGORIES_LIST,
  UPDATE_CATEGORY,
} from '@/services/graphql/categoryAdminService';
import type { Category, UpdateCategoryInput } from '@/types';

interface UpdateCategoryData {
  updateCategory: Category;
}

interface UpdateCategoryVariables {
  updateCategoryInput: UpdateCategoryInput & { _id: string };
}

export function useUpdateAdminCategory() {
  const [updateCategoryMutation, { data, loading, error }] = useMutation<
    UpdateCategoryData,
    UpdateCategoryVariables
  >(UPDATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES_LIST }],
    awaitRefetchQueries: true,
  });

  const updateCategory = async (id: string, inputData: UpdateCategoryInput) => {
    return updateCategoryMutation({
      variables: {
        updateCategoryInput: {
          _id: id,
          ...inputData,
        },
      },
    });
  };

  return { updateCategory, data, loading, error };
}
