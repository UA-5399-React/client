import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { GET_PRODUCTS_PAGE } from '@/services';

import { useAdminProducts } from './useAdminProduct';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

const emptyQueryResult = {
  data: undefined,
  loading: false,
  error: undefined,
} as unknown as ReturnType<typeof ApolloClient.useQuery>;

function getLastQueryCall() {
  const calls = vi.mocked(ApolloClient.useQuery).mock.calls;
  const last = calls[calls.length - 1];
  expect(last).toBeDefined();
  return last as [
    typeof GET_PRODUCTS_PAGE,
    { variables: Record<string, unknown> },
  ];
}

describe('useAdminProducts', () => {
  beforeEach(() => {
    vi.mocked(ApolloClient.useQuery).mockReturnValue(emptyQueryResult);
  });

  it('requests the first page with defaults when no options are passed', () => {
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

  it('sends trimmed search and omits filter when filters are empty', () => {
    renderHook(() =>
      useAdminProducts({
        search: '  tablet  ',
      }),
    );

    const [, options] = getLastQueryCall();
    expect(options.variables).toMatchObject({
      search: 'tablet',
      filter: null,
    });
  });

  it('builds filter from numeric, category, date, and status array fields', () => {
    const dateTo = '2026-04-07';

    renderHook(() =>
      useAdminProducts({
        page: 3,
        limit: 20,
        search: '  iphone  ',
        sort: 'price',
        order: 'asc',
        filters: {
          status: ['ACTIVE', 'INACTIVE'],
          minPrice: '10.5',
          maxPrice: '99.9',
          categories: ['phones', 'accessories'],
          dateFrom: '2026-04-01',
          dateTo,
        },
      }),
    );

    const [, options] = getLastQueryCall();
    expect(options.variables).toEqual({
      limit: 20,
      page: 3,
      search: 'iphone',
      sort: 'price',
      order: 'asc',
      filter: {
        status: ['ACTIVE', 'INACTIVE'],
        minPrice: 10.5,
        maxPrice: 99.9,
        category: ['phones', 'accessories'],
        updatedFrom: new Date('2026-04-01'),
        updatedTo: new Date(`${dateTo}T23:59:59.999`).toISOString(),
      },
    });
  });

  it('does not put status on filter when status array is empty', () => {
    renderHook(() =>
      useAdminProducts({
        filters: {
          status: [],
          minPrice: '5',
        },
      }),
    );

    const [, options] = getLastQueryCall();
    expect(options.variables.filter).toEqual({
      minPrice: 5,
    });
  });

  it('maps productsPage from the query result', () => {
    const items = [
      {
        id: 'p-1',
        title: 'Phone',
        category: { id: 'cat-1', title: 'Phones' },
        price: 500,
        quantity: 3,
        status: 'ACTIVE',
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

  it('uses safe fallbacks and exposes the error when data is missing', () => {
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
