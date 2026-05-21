import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { UPDATE_USER } from '@/services/graphql/userAdminService';

import { useUpdateAdminUser } from './useUpdateAdminUser';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useUpdateAdminUser', () => {
  const updateUserMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('registers UPDATE_USER mutation without default options', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderHook(() => useUpdateAdminUser());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(UPDATE_USER);
  });

  it('updateUser passes variables, refetches users list, and returns payload', async () => {
    const updated = {
      id: 'user-1',
      role: 'ADMIN' as const,
      email: 'a@b.com',
    };

    updateUserMutationMock.mockResolvedValueOnce({
      data: { updateUser: updated },
    });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      {
        data: { updateUser: updated },
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useUpdateAdminUser());

    let payload: unknown = null;
    await act(async () => {
      payload = await result.current.updateUser({
        id: 'user-1',
        role: 'ADMIN',
      });
    });

    expect(updateUserMutationMock).toHaveBeenCalledWith({
      variables: { input: { id: 'user-1', role: 'ADMIN' } },
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
    expect(payload).toEqual(updated);
  });

  it('updateUser returns null when mutation response has no data', async () => {
    updateUserMutationMock.mockResolvedValueOnce({ data: undefined });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useUpdateAdminUser());

    let payload: unknown;
    await act(async () => {
      payload = await result.current.updateUser({ id: 'x' });
    });

    expect(payload).toBeNull();
  });

  it('handleUpdate merges id with partial fields and calls updateUser', async () => {
    const updated = { id: 'u-2', firstName: 'Ann' };

    updateUserMutationMock.mockResolvedValueOnce({
      data: { updateUser: updated },
    });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      {
        data: { updateUser: updated },
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useUpdateAdminUser());

    await act(async () => {
      await result.current.handleUpdate('u-2', { firstName: 'Ann' });
    });

    expect(updateUserMutationMock).toHaveBeenCalledWith({
      variables: { input: { id: 'u-2', firstName: 'Ann' } },
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
  });

  it('handleUpdate logs and rethrows when update fails', async () => {
    const err = new Error('network');
    updateUserMutationMock.mockRejectedValueOnce(err);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    const { result } = renderHook(() => useUpdateAdminUser());

    await act(async () => {
      await expect(result.current.handleUpdate('u-1', {})).rejects.toThrow(
        'network',
      );
    });

    expect(consoleSpy).toHaveBeenCalledWith('Failed to update user:', err);

    consoleSpy.mockRestore();
  });

  it('exposes isUpdating from Apollo loading flag', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      updateUserMutationMock,
      { data: undefined, loading: true, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useUpdateAdminUser());

    expect(result.current.isUpdating).toBe(true);
  });
});
