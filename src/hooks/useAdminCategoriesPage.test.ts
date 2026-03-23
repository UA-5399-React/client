import { useQuery } from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { GET_CATEGORIES_PAGE } from '@/services/graphql/categoryAdminService';

import { useAdminCategoriesPage } from './useAdminCategoriesPage';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

const mockUseQuery = vi.mocked(useQuery);

const mockCategoriesPage = {
  items: [
    {
      id: 'cat1',
      title: 'Electronics',
      depth: 1,
      createdAt: '',
      updatedAt: '',
    },
    { id: 'cat2', title: 'Phones', depth: 2, createdAt: '', updatedAt: '' },
  ],
  totalPages: 3,
  page: 1,
  total: 25,
};

describe('Hook: useAdminCategoriesPage', () => {
  it('should return categories and pagination data on success', () => {
    mockUseQuery.mockReturnValue({
      data: { categoriesPage: mockCategoriesPage },
      loading: false,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategoriesPage());

    expect(result.current.categories).toEqual(mockCategoriesPage.items);
    expect(result.current.totalPages).toBe(3);
    expect(result.current.page).toBe(1);
    expect(result.current.total).toBe(25);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('should call useQuery with default parameters', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    renderHook(() => useAdminCategoriesPage());

    expect(mockUseQuery).toHaveBeenCalledWith(GET_CATEGORIES_PAGE, {
      variables: { page: 1, limit: ADMIN_PAGE_LIMIT, search: null },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('should call useQuery with provided parameters', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    renderHook(() =>
      useAdminCategoriesPage({ page: 2, limit: 5, search: 'phone' }),
    );

    expect(mockUseQuery).toHaveBeenCalledWith(GET_CATEGORIES_PAGE, {
      variables: { page: 2, limit: 5, search: 'phone' },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('should trim and normalize search — empty string becomes null', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    renderHook(() => useAdminCategoriesPage({ search: '   ' }));

    expect(mockUseQuery).toHaveBeenCalledWith(GET_CATEGORIES_PAGE, {
      variables: { page: 1, limit: ADMIN_PAGE_LIMIT, search: null },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('should trim whitespace from search string', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    renderHook(() => useAdminCategoriesPage({ search: '  phone  ' }));

    expect(mockUseQuery).toHaveBeenCalledWith(GET_CATEGORIES_PAGE, {
      variables: { page: 1, limit: ADMIN_PAGE_LIMIT, search: 'phone' },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('should return loading state', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: true,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategoriesPage());

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

    const { result } = renderHook(() => useAdminCategoriesPage());

    expect(result.current.error).toBe(mockError);
    expect(result.current.categories).toEqual([]);
  });

  it('should return safe defaults when data is undefined', () => {
    mockUseQuery.mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as never);

    const { result } = renderHook(() => useAdminCategoriesPage({ page: 4 }));

    expect(result.current.categories).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(4);
    expect(result.current.total).toBe(0);
  });
});
