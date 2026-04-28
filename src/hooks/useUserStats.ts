import { useQuery } from '@apollo/client/react';

import { GET_USER_STATS } from '@/services/graphql/userAdminService';
import type { UserStatsQueryData } from '@/types/statistic.types';
import {
  buildDailyCountsFromRegistrations,
  formatMonthRange,
  resolvePeriod,
} from '@/utils';

export function useUserStats(period?: string, enabled = true) {
  const today = new Date();
  const { year, month } = resolvePeriod(period);

  const { data, loading, error, refetch } = useQuery<UserStatsQueryData>(
    GET_USER_STATS,
    {
      variables: { year, month },
      skip: !enabled,
    },
  );

  const rows = data?.userStats?.registrationsByDay;
  const dailyCounts = !rows?.length
    ? Array.from({ length: new Date(year, month, 0).getDate() }, () => 0)
    : buildDailyCountsFromRegistrations(year, month, rows);

  const registrationsThisMonth = rows?.length
    ? rows.reduce((sum, row) => sum + row.count, 0)
    : (data?.userStats?.registrationsMonth ?? 0);

  const highlightBarIndex =
    today.getFullYear() === year && today.getMonth() + 1 === month
      ? today.getDate() - 1
      : undefined;

  const dateLabel = formatMonthRange(year, month);

  return {
    data,
    loading,
    error,
    refetch,
    year,
    month,
    dailyCounts,
    registrationsThisMonth,
    highlightBarIndex,
    dateLabel,
  };
}
