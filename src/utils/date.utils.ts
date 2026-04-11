// TODO: this utility function is just a placeholder, you can replace it with your own implementation

import type { RegistrationByDayRow } from '@/types/statistic.types';

/**
 * Format a date to a readable string
 */
export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(date);
};

export const formatDateToShort = (date: Date): string => {
  return new Date(date).toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: '2-digit',
  });
};

export function formatMonthRange(year: number, month: number) {
  const last = new Date(year, month, 0).getDate();
  const monthName = new Date(year, month - 1, 1).toLocaleString('en-GB', {
    month: 'long',
  });
  return `1 - ${last} ${monthName} ${year}`;
}

export function buildDailyCountsFromRegistrations(
  year: number,
  month: number,
  rows: RegistrationByDayRow[],
): number[] {
  const daysInMonth = new Date(year, month, 0).getDate();
  const out = Array.from({ length: daysInMonth }, () => 0);
  for (const row of rows) {
    const d = row.day;
    if (d >= 1 && d <= daysInMonth) out[d - 1] = row.count;
  }
  return out;
}
