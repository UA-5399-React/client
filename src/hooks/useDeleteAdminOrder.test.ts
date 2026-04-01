import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DELETE_ORDER } from '@/services/graphql/ordersAdminService';

import { useDeleteAdminOrder } from './useDeleteAdminOrder';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useDeleteAdminOrder', () => {
  const deleteOrderMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures mutation with active refetch options', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteOrderMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderHook(() => useDeleteAdminOrder());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(DELETE_ORDER, {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
  });

  it('calls delete mutation with orderId variable', async () => {
    const mutationResponse = { data: { deleteOrder: true } };
    deleteOrderMutationMock.mockResolvedValueOnce(mutationResponse);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteOrderMutationMock,
      {
        data: mutationResponse.data,
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminOrder());

    let response: unknown;
    await act(async () => {
      response = await result.current.deleteOrder('ORD-20260325-0001');
    });

    expect(deleteOrderMutationMock).toHaveBeenCalledWith({
      variables: { orderId: 'ORD-20260325-0001' },
    });
    expect(response).toEqual(mutationResponse);
    expect(result.current.data).toEqual(mutationResponse.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('exposes loading and error from mutation state', () => {
    const apolloError = new Error('Delete failed');

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteOrderMutationMock,
      { data: undefined, loading: true, error: apolloError },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminOrder());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
