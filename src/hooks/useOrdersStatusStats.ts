import { useQuery } from '@apollo/client/react';

import { GET_ORDERS_STATUS_STATS } from '@/services/graphql/dashboardAdminService';
import type { OrdersStatusStats } from '@/types';

export const useOrdersStatusStats = () => {
  const { data, loading, error } = useQuery<{
    ordersStatusStats: OrdersStatusStats;
  }>(GET_ORDERS_STATUS_STATS);

  return {
    data: data?.ordersStatusStats ?? null,
    isLoading: loading,
    error: error?.message ?? null,
  };
};
