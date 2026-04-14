import { useEffect, useState } from 'react';

import { dashboardService } from '@/services/dashboardService';
import type { OrdersStatusStats } from '@/types';

export const useOrdersStatusStats = () => {
  const [data, setData] = useState<OrdersStatusStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    dashboardService
      .getOrderStatusStats()
      .then(setData)
      .catch((e: Error) => setError(e.message))
      .finally(() => setIsLoading(false));
  }, []);

  return { data, isLoading, error };
};
