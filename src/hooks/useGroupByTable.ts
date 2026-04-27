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

interface UseSalesByProductParams {
  groupBy?: GroupByEnum;
  dateFrom?: string;
  dateTo?: string;
  categoryId?: string | null;
}

export function useGroupByTable({
  groupBy = CATEGORY,
  dateFrom,
  dateTo,
  categoryId = null,
}: UseSalesByProductParams = {}) {
  const defaults = useMemo(() => getDefaultRange(), []);

  const variables: SalesByProductQueryVariables = {
    groupBy,
    dateFrom: dateFrom ?? defaults.dateFrom,
    dateTo: dateTo ?? defaults.dateTo,
    categoryId,
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

  const items =
    groupBy === DAY
      ? ((data as SalesByDayQueryData | undefined)?.getSalesByDay?.items ?? [])
      : groupBy === CATEGORY
        ? ((data as SalesByCategoryQueryData | undefined)?.getSalesByCategory
            ?.items ?? [])
        : ((data as SalesByProductQueryData | undefined)?.getSalesByProduct
            ?.items ?? []);

  const summary =
    groupBy === DAY
      ? ((data as SalesByDayQueryData | undefined)?.getSalesByDay?.summary ??
        null)
      : groupBy === CATEGORY
        ? ((data as SalesByCategoryQueryData | undefined)?.getSalesByCategory
            ?.summary ?? null)
        : ((data as SalesByProductQueryData | undefined)?.getSalesByProduct
            ?.summary ?? null);

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
    groupBy,
    loading,
    error,
    refetch,
  };
}
