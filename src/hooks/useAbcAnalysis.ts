import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

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
  dateFrom?: string;
  dateTo?: string;
  aThreshold?: number;
  bThreshold?: number;
  categoryId?: string | null;
}

export function useAbcAnalysis({
  metric = REVENUE.toUpperCase() as AbcMetricEnum,
  dateFrom,
  dateTo,
  aThreshold = 80,
  bThreshold = 95,
  categoryId = null,
}: UseAbcAnalysisParams = {}) {
  const defaults = useMemo(() => getDefaultDateCurrentMonth(), []);

  const variables: AbcAnalysisQueryVariables = {
    metric,
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

  return {
    items: data?.getAbcAnalysis?.items ?? [],
    summary: data?.getAbcAnalysis?.summary ?? null,
    categoryId,
    loading,
    dateFrom,
    dateTo,
    error,
    refetch,
  };
}
