import { useQuery } from '@apollo/client/react';

import { GET_USER_STATS } from '@/services/graphql/userAdminService';
import type { UserStatsQueryData } from '@/types/statistic.types';
import { buildDailyCountsFromRegistrations, formatMonthRange } from '@/utils';

export type UserStatsPeriod = {
  year: number;
  month: number;
};

export function useUserStats(period?: UserStatsPeriod) {
  const today = new Date();
  const year = period?.year ?? today.getFullYear();
  const month = period?.month ?? today.getMonth() + 1;

  const { data, loading, error, refetch } = useQuery<UserStatsQueryData>(
    GET_USER_STATS,
    {
      variables: { year, month },
    },
  );

  const rows = data?.userStats?.registrationsByDay;
  const dailyCounts = !rows?.length
    ? Array.from({ length: new Date(year, month, 0).getDate() }, () => 0)
    : buildDailyCountsFromRegistrations(year, month, rows);

  const registrationsThisMonth = data?.userStats?.registrationsMonth ?? 0;

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
