import type { CreatedOrder, CreateOrderPayload } from '@/types';
import type { ApiMyOrder } from '@/types/order.api.types';

import { apiClient } from './api';

export const orderService = {
  createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
    return apiClient.post<CreatedOrder>('/orders', payload);
  },

  async getMyOrders(
    page = 1,
    limit = 10,
  ): Promise<{
    items: ApiMyOrder[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    return apiClient.get('/orders/my', {
      params: { page, limit, _t: Date.now() },
    });
  },

  getMyOrderById(orderId: string): Promise<ApiMyOrder> {
    return apiClient.get(`/orders/my/${orderId}`);
  },
};
