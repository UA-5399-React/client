import { useMutation } from '@apollo/client/react';

import { CREATE_PRODUCT, GET_PRODUCTS_PAGE } from '@/services';
import type { Product } from '@/types';

export type CreateProductInput = Partial<Omit<Product, 'id'>>;

export function useCreateAdminProduct() {
  const [createProductMutation, { data, loading, error }] = useMutation(
    CREATE_PRODUCT,
    {
      refetchQueries: [
        { query: GET_PRODUCTS_PAGE, variables: { limit: 10, page: 1 } },
      ],
    },
  );

  const createProduct = async (inputData: CreateProductInput) => {
    return createProductMutation({
      variables: { input: inputData },
    });
  };

  return { createProduct, data, loading, error };
}
