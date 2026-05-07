import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  CREATE_CATEGORY,
  GET_CATEGORIES_LIST,
} from '@/services/graphql/categoryAdminService';

import { useCreateAdminCategory } from './useCreateAdminCategory';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useCreateAdminCategory', () => {
  const createCategoryMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures mutation with categories list refetch', () => {
    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createCategoryMutationMock,
      { data: undefined, loading: false, error: undefined },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    renderHook(() => useCreateAdminCategory());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(CREATE_CATEGORY, {
      refetchQueries: [{ query: GET_CATEGORIES_LIST }],
      awaitRefetchQueries: true,
    });
  });

  it('calls create mutation with input variable', async () => {
    const category = {
      id: 'new-cat',
      title: 'Gadgets',
      depth: 1 as const,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    };
    const input = { title: 'Gadgets', depth: 1 as const };
    const mutationResponse = { data: { createCategory: category } };
    createCategoryMutationMock.mockResolvedValueOnce(mutationResponse);

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createCategoryMutationMock,
      {
        data: mutationResponse.data,
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useCreateAdminCategory());

    let response: unknown;
    await act(async () => {
      response = await result.current.createCategory(input);
    });

    expect(createCategoryMutationMock).toHaveBeenCalledWith({
      variables: { createCategoryInput: input },
    });
    expect(response).toEqual(mutationResponse);
    expect(result.current.data).toEqual(mutationResponse.data);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('exposes loading and error from mutation state', () => {
    const apolloError = new Error('Create failed');

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createCategoryMutationMock,
      { data: undefined, loading: true, error: apolloError },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useCreateAdminCategory());

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
