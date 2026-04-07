import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import { GET_ORDERS } from '@/services/graphql/ordersAdminService';
import type { CreateOrderPayload } from '@/types';
import { ORDER_STATUS } from '@/types/tableOrders.types';

import { useAdminCreateOrderFlow } from './useAdminCreateOrderFlow';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useAdminCreateOrderFlow', () => {
  const createOrderMutationMock = vi.fn();

  const payload: CreateOrderPayload = {
    items: [{ product: 'product-1', amount: 2 }],
    shippingAddress: {
      carrier: 'nova_post',
      city: 'Lviv',
      branchNumber: '12',
    },
    user: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      phone: '+380991112233',
    },
    paymentMethod: 'cash_on_delivery',
    message: 'leave at the door',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state from mutation', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createOrderMutationMock,
      { loading: true },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminCreateOrderFlow());

    expect(result.current.isCreatingOrder).toBe(true);
  });

  it('calls createOrder mutation with transformed input and refetch config', async () => {
    createOrderMutationMock.mockResolvedValueOnce({ data: {} });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createOrderMutationMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminCreateOrderFlow());

    await act(async () => {
      await result.current.createOrder(payload);
    });

    expect(createOrderMutationMock).toHaveBeenCalledWith({
      variables: {
        input: {
          ...payload,
          status: 'NEW',
          paymentMethod: 'CASH_ON_DELIVERY',
          shippingAddress: {
            ...payload.shippingAddress,
            carrier: 'NOVA_POST',
          },
        },
      },
      refetchQueries: [
        {
          query: GET_ORDERS,
          variables: ORDERS_QUERY,
        },
      ],
      awaitRefetchQueries: true,
    });
  });

  it('returns mutation response and uses explicit status when provided', async () => {
    const mutationResponse = {
      data: { createOrder: { orderId: 'ORD-20260407-0001' } },
    };
    createOrderMutationMock.mockResolvedValueOnce(mutationResponse);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createOrderMutationMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminCreateOrderFlow());

    let response: unknown;
    await act(async () => {
      response = await result.current.createOrder(
        payload,
        ORDER_STATUS.PROCESSING,
      );
    });

    expect(createOrderMutationMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            status: 'PROCESSING',
          }),
        },
      }),
    );
    expect(response).toEqual(mutationResponse);
  });
});
