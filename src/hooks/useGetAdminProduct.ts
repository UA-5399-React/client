import { useQuery } from '@apollo/client/react';

import { GET_PRODUCT } from '@/services/graphql/productAdminService';
import type { ProductImage, ProductStatusUpperCase } from '@/types';

interface GetProductData {
  product: {
    id: string;
    title: string;
    price: number;
    updatedAt: string;
    status: ProductStatusUpperCase;
    description: string;
    categories: string[];
    imageUrl?: string;
    additionalImages?: ProductImage[];
  };
}

export function useGetAdminProduct(id?: string) {
  const { data, loading, error } = useQuery<GetProductData>(GET_PRODUCT, {
    variables: { id },
    skip: !id,
  });

  return {
    product: data?.product,
    loading,
    error,
  };
}
