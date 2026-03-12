import { useMutation } from '@apollo/client/react';

import { DELETE_PRODUCT } from '@/services/graphql/productAdminService';

export function useDeleteAdminProduct() {
  const [deleteProductMutation, { data, loading, error }] = useMutation(
    DELETE_PRODUCT,
    {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    },
  );

  const deleteProduct = async (id: string) => {
    return deleteProductMutation({
      variables: { id },
    });
  };

  return { deleteProduct, data, loading, error };
}
