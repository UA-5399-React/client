import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import { ADMIN_PAGE_LIMIT } from '@/constants';
import { PAGE } from '@/constants/general';
import { REVENUE } from '@/constants/general';
import { GET_ABC_ANALYSIS } from '@/services/graphql/statisticsAdminService';
import type {
  AbcAnalysisQueryData,
  AbcAnalysisQueryVariables,
  AbcMetricEnum,
} from '@/types/statistic.types';
import { getDefaultDateCurrentMonth } from '@/utils/date.utils';

interface UseAbcAnalysisParams {
  metric?: AbcMetricEnum;
  page?: number;
  limit?: number;
  dateFrom?: string;
  dateTo?: string;
  aThreshold?: number;
  bThreshold?: number;
  categoryId?: string | null;
}

export function useAbcAnalysis({
  metric = REVENUE.toUpperCase() as AbcMetricEnum,
  page = PAGE,
  limit = ADMIN_PAGE_LIMIT,
  dateFrom,
  dateTo,
  aThreshold = 80,
  bThreshold = 95,
  categoryId = null,
}: UseAbcAnalysisParams = {}) {
  const defaults = useMemo(() => getDefaultDateCurrentMonth(), []);

  const variables: AbcAnalysisQueryVariables = {
    metric,
    page,
    limit,
    dateFrom: dateFrom ?? defaults.dateFrom,
    dateTo: dateTo ?? defaults.dateTo,
    aThreshold,
    bThreshold,
    categoryId,
  };

  const { data, loading, error, refetch } = useQuery<
    AbcAnalysisQueryData,
    AbcAnalysisQueryVariables
  >(GET_ABC_ANALYSIS, { variables });
  const total = data?.getAbcAnalysis?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    items: data?.getAbcAnalysis?.items ?? [],
    summary: data?.getAbcAnalysis?.summary ?? null,
    categoryId,
    total,
    totalPages,
    loading,
    dateFrom,
    dateTo,
    error,
    refetch,
  };
}
