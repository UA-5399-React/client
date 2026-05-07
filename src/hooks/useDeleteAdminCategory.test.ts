import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DELETE_CATEGORY } from '@/services/graphql/categoryAdminService';

import { useDeleteAdminCategory } from './useDeleteAdminCategory';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useDeleteAdminCategory', () => {
  const deleteCategoryMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures mutation with active refetch options', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteCategoryMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderHook(() => useDeleteAdminCategory());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(DELETE_CATEGORY, {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });
  });

  it('calls delete mutation with id variable', async () => {
    const mutationResponse = { data: { deleteCategory: { id: 'cat-1' } } };
    deleteCategoryMutationMock.mockResolvedValueOnce(mutationResponse);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteCategoryMutationMock,
      {
        data: mutationResponse.data,
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminCategory());

    let response: unknown;
    await act(async () => {
      response = await result.current.deleteCategory('cat-1');
    });

    expect(deleteCategoryMutationMock).toHaveBeenCalledWith({
      variables: { id: 'cat-1' },
    });
    expect(response).toEqual(mutationResponse);
    expect(result.current.data).toEqual(mutationResponse.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('exposes loading and error from mutation state', () => {
    const apolloError = new Error('Delete failed');

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      deleteCategoryMutationMock,
      { data: undefined, loading: true, error: apolloError },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useDeleteAdminCategory());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
