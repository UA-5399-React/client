import { useMutation } from '@apollo/client/react';

import {
  DUPLICATE_PRODUCT,
  GET_PRODUCTS_PAGE,
} from '@/services/graphql/productAdminService';
import type { Product } from '@/types';

export type CreateProductInput = Partial<Omit<Product, 'id'>>;

export function useDuplicate() {
  const [duplicateMutation, { data, loading, error }] = useMutation(
    DUPLICATE_PRODUCT,
    {
      refetchQueries: [
        { query: GET_PRODUCTS_PAGE, variables: { limit: 10, page: 1 } },
      ],
    },
  );

  const duplicateProduct = async (id: string) => {
    return duplicateMutation({
      variables: { id },
    });
  };

  return { duplicateProduct, data, loading, error };
}
