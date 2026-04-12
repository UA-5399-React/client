import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DELETE_USER } from '@/services/graphql/userAdminService';

import { useDeleteAdminUser } from './useDeleteAdminUser';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useDeleteAdminUser', () => {
  const deleteUserMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures mutation with active refetch options', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteUserMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderHook(() => useDeleteAdminUser());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(DELETE_USER, {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
  });

  it('calls delete mutation with id variable', async () => {
    const mutationResponse = { data: { deleteUser: true } };
    deleteUserMutationMock.mockResolvedValueOnce(mutationResponse);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteUserMutationMock,
      {
        data: mutationResponse.data,
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminUser());

    let response: unknown;
    await act(async () => {
      response = await result.current.deleteUser('USER-123');
    });

    expect(deleteUserMutationMock).toHaveBeenCalledWith({
      variables: { id: 'USER-123' },
    });
    expect(response).toEqual(mutationResponse);
    expect(result.current.data).toEqual(mutationResponse.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('exposes loading and error from mutation state', () => {
    const apolloError = new Error('Delete failed');

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteUserMutationMock,
      { data: undefined, loading: true, error: apolloError },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminUser());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
