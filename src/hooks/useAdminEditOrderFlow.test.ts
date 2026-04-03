import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import { GET_ORDERS } from '@/services/graphql/ordersAdminService';

import { useAdminEditOrderFlow } from './useAdminEditOrderFlow';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useAdminEditOrderFlow', () => {
  const updateOrderUserInfoMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns loading state from mutation', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderUserInfoMock,
      { loading: true },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    expect(result.current.isUpdatingUserInfo).toBe(true);
  });

  it('calls mutation with normalized customer name and refetch config', async () => {
    updateOrderUserInfoMock.mockResolvedValueOnce({ data: {} });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderUserInfoMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    await act(async () => {
      await result.current.updateUserInfo('ORD-20260325-0001', {
        customerName: '   John    Ronald   Reuel   ',
        email: 'john@example.com',
        phone: '+380991112233',
      });
    });

    expect(updateOrderUserInfoMock).toHaveBeenCalledWith({
      variables: {
        input: {
          orderId: 'ORD-20260325-0001',
          user: {
            firstName: 'John',
            lastName: 'Ronald Reuel',
            email: 'john@example.com',
            phone: '+380991112233',
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

  it('logs and rethrows when mutation fails', async () => {
    const mutationError = new Error('Update failed');
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => undefined);

    updateOrderUserInfoMock.mockRejectedValueOnce(mutationError);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateOrderUserInfoMock,
      { loading: false },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useAdminEditOrderFlow());

    await expect(
      result.current.updateUserInfo('ORD-20260325-0001', {
        customerName: 'John Doe',
        email: 'john@example.com',
        phone: '+380991112233',
      }),
    ).rejects.toThrow('Update failed');

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Failed to update order user info:',
      mutationError,
    );

    consoleErrorSpy.mockRestore();
  });
});
