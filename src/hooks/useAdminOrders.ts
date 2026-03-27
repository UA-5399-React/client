import { useQuery } from '@apollo/client/react';

import { GET_ORDERS } from '@/services/graphql/ordersAdminService';
import type { GetOrdersData } from '@/types/tableOrders.types';

export function useAdminOrders(status?: string) {
  const { data, loading, error } = useQuery<GetOrdersData>(GET_ORDERS, {
    variables: {
      page: 1,
      limit: 10,
      sort: 'createdAt',
      order: 'desc',
      filter:
        status && status !== 'all' ? { status: status.toUpperCase() } : {},
    },

    fetchPolicy: 'cache-and-network',
  });

  return {
    orders: data?.orders.items ?? [],
    loading,
    error,
  };
}
