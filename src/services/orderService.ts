import type { CreatedOrder, CreateOrderPayload } from '@/types';

import { apiClient } from './api';

export const orderService = {
  createOrder(payload: CreateOrderPayload): Promise<CreatedOrder> {
    return apiClient.post<CreatedOrder>('/orders', payload);
  },
};
