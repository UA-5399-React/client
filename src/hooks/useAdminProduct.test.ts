import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { GET_PRODUCTS_PAGE } from '@/services';

import { useAdminProducts } from './useAdminProduct';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

describe('useAdminProducts', () => {
  it('calls query with default params and null search/filter', () => {
    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    renderHook(() => useAdminProducts());

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_PRODUCTS_PAGE, {
      variables: {
        limit: ADMIN_PAGE_LIMIT,
        page: 1,
        search: null,
        sort: 'updatedAt',
        order: 'desc',
        filter: null,
      },
      fetchPolicy: 'cache-and-network',
      notifyOnNetworkStatusChange: true,
    });
  });

  it('trims search and builds filter payload from params', () => {
    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const dateTo = '2026-04-07';

    renderHook(() =>
      useAdminProducts({
        page: 3,
        limit: 20,
        search: '  iphone  ',
        sort: 'price',
        order: 'asc',
        filters: {
          status: 'active',
          minPrice: '10.5',
          maxPrice: '99.9',
          categories: ['phones', 'accessories'],
          dateFrom: '2026-04-01',
          dateTo,
        },
      }),
    );

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(
      GET_PRODUCTS_PAGE,
      expect.objectContaining({
        variables: {
          limit: 20,
          page: 3,
          search: 'iphone',
          sort: 'price',
          order: 'asc',
          filter: {
            status: 'active',
            minPrice: 10.5,
            maxPrice: 99.9,
            category: ['phones', 'accessories'],
            updatedFrom: new Date('2026-04-01'),
            updatedTo: new Date(`${dateTo}T23:59:59.999`).toISOString(),
          },
        },
      }),
    );
  });

  it('returns mapped products page values', () => {
    const items = [
      {
        id: 'p-1',
        title: 'Phone',
        category: { id: 'cat-1', title: 'Phones' },
        price: 500,
        quantity: 3,
        status: 'active',
        imageUrls: [],
        createdAt: '2026-04-01T10:00:00.000Z',
        updatedAt: '2026-04-07T10:00:00.000Z',
      },
    ];

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: {
        productsPage: {
          items,
          page: 2,
          totalPages: 7,
          total: 120,
        },
      },
      loading: true,
      error: undefined,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useAdminProducts({ page: 2 }));

    expect(result.current.items).toEqual(items);
    expect(result.current.loading).toBe(true);
    expect(result.current.totalPages).toBe(7);
    expect(result.current.page).toBe(2);
    expect(result.current.total).toBe(120);
  });

  it('returns fallback values when query has no data', () => {
    const queryError = new Error('Network failed');
    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: queryError,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useAdminProducts({ page: 4 }));

    expect(result.current.items).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.page).toBe(4);
    expect(result.current.total).toBe(0);
    expect(result.current.error).toBe(queryError);
  });
});
