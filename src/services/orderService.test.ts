import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/services/api';
import type { CreatedOrder, CreateOrderPayload } from '@/types';
import { PAYMENT_METHODS, SHIPPING_CARRIERS } from '@/types';
import type { ApiMyOrder } from '@/types/order.api.types';

import { orderService } from './orderService';

vi.mock('@/services/api', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('orderService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('createOrder posts payload to /orders', async () => {
    const payload: CreateOrderPayload = {
      items: [{ product: 'p1', amount: 1 }],
      shippingAddress: {
        carrier: SHIPPING_CARRIERS.NOVA_POST,
        city: 'Kyiv',
        branchNumber: '12',
      },
      user: {
        firstName: 'Ann',
        lastName: 'Bee',
        email: 'ann@example.com',
        phone: '+380000000000',
      },
      paymentMethod: PAYMENT_METHODS.STRIPE,
    };

    const created: CreatedOrder = {
      orderId: 'ord-1',
      items: [
        {
          product: 'p1',
          title: 'Product 1',
          unitPrice: 99,
          amount: 1,
        },
      ],
      totalPrice: 99,
      amount: 1,
    };

    vi.mocked(apiClient.post).mockResolvedValueOnce(created);

    const result = await orderService.createOrder(payload);

    expect(apiClient.post).toHaveBeenCalledWith('/orders', payload);
    expect(result).toEqual(created);
  });

  it('getMyOrders requests /orders/my', async () => {
    const orders: ApiMyOrder[] = [];

    vi.mocked(apiClient.get).mockResolvedValueOnce(orders);

    const result = await orderService.getMyOrders();

    expect(apiClient.get).toHaveBeenCalledWith('/orders/my');
    expect(result).toEqual(orders);
  });
});
