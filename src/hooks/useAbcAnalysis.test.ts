import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { PAGE, REVENUE } from '@/constants/general';
import { GET_ABC_ANALYSIS } from '@/services/graphql/statisticsAdminService';

import { useAbcAnalysis } from './useAbcAnalysis';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

describe('useAbcAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-15T12:30:45.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('calls query with default variables and computed date range', () => {
    const refetch = vi.fn();

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: undefined,
      refetch,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    renderHook(() => useAbcAnalysis());

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_ABC_ANALYSIS, {
      variables: {
        metric: REVENUE.toUpperCase(),
        page: PAGE,
        limit: ADMIN_PAGE_LIMIT,
        dateFrom: '2026-05-01T00:00:00.000Z',
        dateTo: '2026-05-15T12:30:45.000Z',
        aThreshold: 80,
        bThreshold: 95,
        categoryId: null,
      },
    });
  });

  it('returns mapped data and respects custom params', () => {
    const refetch = vi.fn();
    const items = [
      {
        productName: 'Phone',
        productCode: 'P-1001',
        value: 15,
        cumulativeValue: 15,
        totalValue: 100,
        cumulativePercentage: 15,
        percentageByTotal: 15,
        bucket: 'A' as const,
      },
    ];
    const summary = {
      aCount: 2,
      bCount: 3,
      cCount: 4,
      metric: 'UNITS' as const,
      totalValue: 100,
    };

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: {
        getAbcAnalysis: {
          items,
          summary,
          total: 9,
        },
      },
      loading: true,
      error: undefined,
      refetch,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() =>
      useAbcAnalysis({
        metric: 'UNITS',
        page: 2,
        limit: 25,
        dateFrom: '2026-05-10T00:00:00.000Z',
        dateTo: '2026-05-12T00:00:00.000Z',
        aThreshold: 70,
        bThreshold: 90,
        categoryId: 'cat-1',
      }),
    );

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_ABC_ANALYSIS, {
      variables: {
        metric: 'UNITS',
        page: 2,
        limit: 25,
        dateFrom: '2026-05-10T00:00:00.000Z',
        dateTo: '2026-05-12T00:00:00.000Z',
        aThreshold: 70,
        bThreshold: 90,
        categoryId: 'cat-1',
      },
    });
    expect(result.current.items).toEqual(items);
    expect(result.current.summary).toEqual(summary);
    expect(result.current.total).toBe(9);
    expect(result.current.loading).toBe(true);
    expect(result.current.refetch).toBe(refetch);
  });

  it('returns fallback values when query data is missing', () => {
    const queryError = new Error('Network error');
    const refetch = vi.fn();

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: queryError,
      refetch,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useAbcAnalysis({ page: 3 }));

    expect(result.current.items).toEqual([]);
    expect(result.current.summary).toBeNull();
    expect(result.current.total).toBe(PAGE);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(queryError);
    expect(result.current.refetch).toBe(refetch);
  });
});
