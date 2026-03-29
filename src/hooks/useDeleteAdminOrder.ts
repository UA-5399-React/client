import { useMutation } from '@apollo/client/react';

import { DELETE_ORDER } from '@/services/graphql/ordersAdminService';

interface DeleteOrderData {
  deleteOrder: boolean;
}

interface DeleteOrderVariables {
  orderId: string;
}

export function useDeleteAdminOrder() {
  const [deleteOrderMutation, { data, loading, error }] = useMutation<
    DeleteOrderData,
    DeleteOrderVariables
  >(DELETE_ORDER, {
    refetchQueries: 'active',
    awaitRefetchQueries: true,
  });

  const deleteOrder = async (orderId: string) => {
    return deleteOrderMutation({
      variables: { orderId },
    });
  };

  return { deleteOrder, data, loading, error };
}
