import { useMutation, useQuery } from '@apollo/client/react';

import { ORDER, PAGE, PAGE_LIMIT, SORT } from '@/constants/general';
import {
  GET_ORDERS,
  UPDATE_ORDER_STATUS,
} from '@/services/graphql/ordersAdminService';
import type { GetOrdersData, OrderStatus } from '@/types/tableOrders.types';

const ORDERS_QUERY_VARIABLES = {
  page: PAGE,
  limit: PAGE_LIMIT,
  sort: SORT,
  order: ORDER,
} as const;

export function useAdminOrders() {
  const [updateOrderStatus] = useMutation(UPDATE_ORDER_STATUS);

  const { data, loading, error } = useQuery<GetOrdersData>(GET_ORDERS, {
    variables: ORDERS_QUERY_VARIABLES,
  });

  const handleOrderStatusChange = async (
    orderId: string,
    status: OrderStatus,
  ) => {
    try {
      await updateOrderStatus({
        variables: {
          input: {
            orderId,
            status: status.toUpperCase(),
          },
        },
        refetchQueries: [
          {
            query: GET_ORDERS,
            variables: ORDERS_QUERY_VARIABLES,
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
