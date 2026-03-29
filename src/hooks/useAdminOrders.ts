import { useMutation, useQuery } from '@apollo/client/react';

import { ORDER, PAGE, PAGE_LIMIT, SORT } from '@/constants/general';
import {
  GET_ORDERS,
  UPDATE_ORDER_STATUS,
} from '@/services/graphql/ordersAdminService';
import {
  ALL_STATUS,
  type GetOrdersData,
  type OrderStatus,
} from '@/types/tableOrders.types';

export function useAdminOrders(status?: string) {
  const filter =
    status && status !== ALL_STATUS ? { status: status.toUpperCase() } : {};

  const queryVariables = {
    page: PAGE,
    limit: PAGE_LIMIT,
    sort: SORT,
    order: ORDER,
    filter,
  };

  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  const { data, loading, error } = useQuery<GetOrdersData>(GET_ORDERS, {
    variables: queryVariables,
    fetchPolicy: 'cache-and-network',
  });

  const handleOrderStatusChange = async (
    orderId: string,
    newStatus: OrderStatus,
  ) => {
    try {
      await updateOrderStatus({
        variables: {
          input: {
            orderId,
            status: newStatus.toUpperCase(),
          },
        },
        refetchQueries: [
          {
            query: GET_ORDERS,
            variables: queryVariables,
          },
        ],
        awaitRefetchQueries: true,
      });
    } catch (mutationError) {
      console.error('Failed to update order status:', mutationError);
    }
  };

  return {
    orders: data?.orders.items ?? [],
    loading,
    error,
    handleOrderStatusChange,
  };
}
