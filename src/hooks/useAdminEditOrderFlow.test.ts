import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import { GET_ORDERS } from '@/services/graphql/ordersAdminService';
import { ORDER_STATUS } from '@/types/tableOrders.types';

import { useAdminEditOrderFlow } from './useAdminEditOrderFlow';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useAdminEditOrderFlow', () => {
  const updateOrderMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state from mutation', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderMock,
      { loading: true },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    expect(result.current.isUpdateOrderInfo).toBe(true);
  });

  it('calls updateOrder mutation with items and refetch config', async () => {
    updateOrderMock.mockResolvedValueOnce({ data: {} });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    await act(async () => {
      await result.current.updateOrder('ORD-20260325-0001', {
        status: ORDER_STATUS.PROCESSING,
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        phone: '+380991112233',
        shippingAddress: {
          carrier: 'nova_post',
          city: 'Kyiv',
          branchNumber: 141,
        },
        items: [{ productId: 'p1', amount: 2 }],
      });
    });

    expect(updateOrderMock).toHaveBeenCalledWith({
      variables: {
        input: {
          orderId: 'ORD-20260325-0001',
          status: 'PROCESSING',
          user: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            phone: '+380991112233',
          },
          shippingAddress: {
            carrier: 'NOVA_POST',
            city: 'Kyiv',
            branchNumber: 141,
          },
          items: [{ productId: 'p1', amount: 2 }],
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

  it('maps removal lines to { productId, amount, remove: true }', async () => {
    updateOrderMock.mockResolvedValueOnce({ data: {} });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    await act(async () => {
      await result.current.updateOrder('ORD-1', {
        status: ORDER_STATUS.NEW,
        firstName: 'A',
        lastName: 'B',
        email: 'a@b.c',
        phone: '1',
        shippingAddress: {
          carrier: 'ukrposhta',
          city: 'Lviv',
          branchNumber: 7,
        },
        items: [
          { productId: 'p1', amount: 1 },
          { productId: 'p2', amount: 4, remove: true },
        ],
      });
    });

    expect(updateOrderMock).toHaveBeenCalledWith(
      expect.objectContaining({
        variables: {
          input: expect.objectContaining({
            shippingAddress: {
              carrier: 'UKRPOSHTA',
              city: 'Lviv',
              branchNumber: 7,
            },
            items: [
              { productId: 'p1', amount: 1 },
              { productId: 'p2', amount: 4, remove: true },
            ],
          }),
        },
      }),
    );
  });

  it('logs and rethrows when mutation fails', async () => {
    const mutationError = new Error('Update failed');
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    updateOrderMock.mockRejectedValueOnce(mutationError);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    await expect(
      result.current.updateOrder('ORD-20260325-0001', {
        status: ORDER_STATUS.NEW,
        firstName: 'Jane',
        lastName: 'Roe',
        email: 'jane@example.com',
        phone: '+380000000000',
        shippingAddress: {
          carrier: 'meest',
          city: 'Dnipro',
          branchNumber: 3,
        },
        items: [{ productId: 'p2', amount: 1 }],
      }),
    ).rejects.toThrow('Update failed');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to update order:',
      mutationError,
    );

    consoleErrorSpy.mockRestore();
  });
});
