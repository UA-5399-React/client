import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET_CATEGORY } from '@/services/graphql/categoryAdminService';

import { useGetAdminCategory } from './useGetAdminCategory';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

describe('useGetAdminCategory', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns category data when id is provided', () => {
    const category = {
      id: 'category-1',
      title: 'Phones',
      imageUrl: 'https://example.com/phone.jpg',
      description: 'Smartphones and accessories',
      parent: null,
      depth: 1,
      createdAt: '2026-03-20T10:00:00.000Z',
      updatedAt: '2026-03-20T10:00:00.000Z',
    };

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: { category },
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useGetAdminCategory('category-1'));

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_CATEGORY, {
      variables: { id: 'category-1' },
      skip: false,
    });
    expect(result.current.category).toEqual(category);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('skips query when id is missing and exposes undefined category', () => {
    const queryError = new Error('Missing id');

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: queryError,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useGetAdminCategory());

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_CATEGORY, {
      variables: { id: undefined },
      skip: true,
    });
    expect(result.current.category).toBeUndefined();
    expect(result.current.error).toBe(queryError);
  });
});
