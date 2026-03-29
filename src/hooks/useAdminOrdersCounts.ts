import { useQuery } from '@apollo/client/react';

import { GET_ORDERS_COUNTS } from '@/services/graphql/ordersAdminService';

interface GetOrdersCountsData {
  all: { total: number };
  new: { total: number };
  processing: { total: number };
  shipping: { total: number };
  completed: { total: number };
  cancelled: { total: number };
}

export function useAdminOrdersCounts() {
  const { data, loading, error } =
    useQuery<GetOrdersCountsData>(GET_ORDERS_COUNTS);

  const counts = {
    new: data?.new?.total || 0,
    processing: data?.processing?.total || 0,
    shipping: data?.shipping?.total || 0,
    completed: data?.completed?.total || 0,
    cancelled: data?.cancelled?.total || 0,
    all: data?.all?.total || 0,
  };

  return { counts, loading, error };
}
