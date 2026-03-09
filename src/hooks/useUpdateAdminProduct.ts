import { useMutation } from '@apollo/client/react';

import {
  GET_PRODUCTS_PAGE,
  UPDATE_PRODUCT,
} from '@/services/graphql/productAdminService';
import type { Product } from '@/types';

export type UpdateProductInput = Partial<Omit<Product, 'id'>> & {
  categories?: string[];
};

export function useUpdateAdminProduct() {
  const [updateProductMutation, { data, loading, error }] = useMutation(
    UPDATE_PRODUCT,
    {
      refetchQueries: [
        { query: GET_PRODUCTS_PAGE, variables: { limit: 12, page: 1 } },
      ],
    },
  );

  const updateProduct = async (id: string, inputData: UpdateProductInput) => {
    return updateProductMutation({
      variables: {
        id,
        input: inputData,
      },
    });
  };

  return { updateProduct, data, loading, error };
}
