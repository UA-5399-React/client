import { useMutation } from '@apollo/client/react';

import {
  CREATE_CATEGORY,
  GET_CATEGORIES_LIST,
} from '@/services/graphql/categoryAdminService';
import type { Category, CreateCategoryInput } from '@/types';

interface CreateCategoryData {
  createCategory: Category;
}

interface CreateCategoryVariables {
  createCategoryInput: CreateCategoryInput;
}

export function useCreateAdminCategory() {
  const [createCategoryMutation, { data, loading, error }] = useMutation<
    CreateCategoryData,
    CreateCategoryVariables
  >(CREATE_CATEGORY, {
    refetchQueries: [{ query: GET_CATEGORIES_LIST }],
    awaitRefetchQueries: true,
  });

  const createCategory = async (inputData: CreateCategoryInput) => {
    return createCategoryMutation({
      variables: { createCategoryInput: inputData },
    });
  };

  return { createCategory, data, loading, error };
}
