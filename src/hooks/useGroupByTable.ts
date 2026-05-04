import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import { CATEGORY, DAY } from '@/constants/general';
import {
  GET_SALES_BY_CATEGORY,
  GET_SALES_BY_DAY,
  GET_SALES_BY_PRODUCT,
} from '@/services/graphql/statisticsAdminService';
import type {
  GroupByEnum,
  SalesByCategoryItem,
  SalesByCategoryQueryData,
  SalesByCategorySummary,
  SalesByDayItem,
  SalesByDayQueryData,
  SalesByDaySummary,
  SalesByProductItem,
  SalesByProductQueryData,
  SalesByProductQueryVariables,
  SalesByProductSummary,
} from '@/types/statistic.types';

function getDefaultRange() {
  const now = new Date();
  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
  );

  return {
    dateFrom: startOfMonth.toISOString(),
    dateTo: now.toISOString(),
  };
}
interface UseGroupByTableParams {
  groupBy?: GroupByEnum;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string | null;
  page?: number;
  limit?: number;
}

export function useGroupByTable({
  groupBy = CATEGORY,
  dateFrom,
  dateTo,
  categoryId = null,
  page = 1,
  limit = 10,
}: UseGroupByTableParams = {}) {
  const defaults = useMemo(() => getDefaultRange(), []);

  const variables: SalesByProductQueryVariables = {
    groupBy,
    dateFrom: dateFrom ?? defaults.dateFrom,
    dateTo: dateTo ?? defaults.dateTo,
    categoryId,
    page,
    limit,
  };

  const query =
    groupBy === DAY
      ? GET_SALES_BY_DAY
      : groupBy === CATEGORY
        ? GET_SALES_BY_CATEGORY
        : GET_SALES_BY_PRODUCT;

  const { data, loading, error, refetch } = useQuery<
    SalesByProductQueryData | SalesByDayQueryData | SalesByCategoryQueryData,
    SalesByProductQueryVariables
  >(query, {
    variables,
  });

  const response =
    groupBy === DAY
      ? (data as SalesByDayQueryData | undefined)?.getSalesByDay
      : groupBy === CATEGORY
        ? (data as SalesByCategoryQueryData | undefined)?.getSalesByCategory
        : (data as SalesByProductQueryData | undefined)?.getSalesByProduct;

  const items = response?.items ?? [];
  const summary = response?.summary ?? null;
  const total = response?.total ?? 0;
  const currentPage = response?.page ?? page;
  const currentLimit = response?.limit ?? limit;
  const totalPages = total > 0 ? Math.ceil(total / currentLimit) : 0;

  return {
    items: items as
      | SalesByProductItem[]
      | SalesByDayItem[]
      | SalesByCategoryItem[],
    summary: summary as
      | SalesByProductSummary
      | SalesByDaySummary
      | SalesByCategorySummary
      | null,
    total,
    page: currentPage,
    limit: currentLimit,
    totalPages,
    groupBy,
    loading,
    error,
    refetch,
  };
}
