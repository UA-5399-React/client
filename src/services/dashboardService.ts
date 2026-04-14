import { apiClient } from '@/services/api';
import type { OrdersStatusStats } from '@/types';

export const dashboardService = {
  getOrderStatusStats: (): Promise<OrdersStatusStats> =>
    apiClient.get<OrdersStatusStats>('/orders/admin/status-stats'),
};
