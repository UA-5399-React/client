import { useQuery } from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GET_CATEGORIES_LIST } from '@/services/graphql/categoryAdminService';

import { useAdminCategories } from './useAdminCategories';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

const mockUseQuery = vi.mocked(useQuery);

const mockCategories = [
  { id: 'cat1', title: 'Electronics', depth: 1, createdAt: '', updatedAt: '' },
  { id: 'cat2', title: 'Phones', depth: 2, createdAt: '', updatedAt: '' },
];

describe('Hook: useAdminCategories', () => {
  it('should call useQuery with correct options', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    renderHook(() => useAdminCategories());

    expect(mockUseQuery).toHaveBeenCalledWith(GET_CATEGORIES_LIST, {
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('should return categories on success', () => {
    mockUseQuery.mockReturnValue({
      data: { categoriesList: mockCategories },
      loading: false,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategories());

    expect(result.current.categories).toEqual(mockCategories);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should return loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategories());

    expect(result.current.loading).toBe(true);
    expect(result.current.categories).toEqual([]);
  });

  it('should return error state', () => {
    const mockError = new Error('Network error');
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: mockError,
    } as never);

    const { result } = renderHook(() => useAdminCategories());

    expect(result.current.error).toBe(mockError);
    expect(result.current.categories).toEqual([]);
  });

  it('should return empty array when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategories());

    expect(result.current.categories).toEqual([]);
  });
});
