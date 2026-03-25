import { useQuery } from '@apollo/client/react';

import { GET_ORDERS } from '@/services/graphql/ordersAdminService';
import type { GetOrdersData } from '@/types/tableOrders.types';

export function useAdminOrders() {
  const { data, loading, error } = useQuery<GetOrdersData>(GET_ORDERS, {
    variables: {
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
    },
  });

  return {
    orders: data?.orders.items ?? [],
    loading,
    error,
  };
}
