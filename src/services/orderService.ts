import type { CreatedOrder, CreateOrderPayload } from '@/types';
import type { ApiMyOrder } from '@/types/order.api.types';

import { apiClient } from './api';

export const orderService = {
  createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
    return apiClient.post<CreatedOrder>('/orders', payload);
  },

  getMyOrders(): Promise<ApiMyOrder[]> {
    return apiClient.get<ApiMyOrder[]>('/orders/my');
  },
};
