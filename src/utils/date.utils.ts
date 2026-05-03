// TODO: this utility function is just a placeholder, you can replace it with your own implementation

import type { RegistrationByDayRow } from '@/types/statistic.types';

/**
 * Format a date to a readable string
 */

export function toDateInputValue(date: Date): string {
  return date.toISOString().split('T')[0];
}

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

export function getCurrentMonthPeriod() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function getDefaultDateCurrentMonth() {
  const now = new Date();
  const startOfMonth = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0),
  );

  return {
    dateFrom: startOfMonth.toISOString(),
    dateTo: now.toISOString(),
  };
}

export function getDefaultDateCurrentMonthForInput() {
  const to = new Date();
  const from = new Date(to.getFullYear(), to.getMonth(), 1);

  return {
    dateFrom: toDateInputValue(from),
    dateTo: toDateInputValue(to),
  };
}

export function toIsoDateRange(dateFrom: string, dateTo: string) {
  return {
    dateFrom: new Date(dateFrom).toISOString(),
    dateTo: new Date(`${dateTo}T23:59:59`).toISOString(),
  };
}

export function resolvePeriod(period?: string) {
  const today = new Date();
  if (!period) {
    return { year: today.getFullYear(), month: today.getMonth() + 1 };
  }

  const [yearRaw, monthRaw] = period.split('-');
  const parsedYear = Number(yearRaw);
  const parsedMonth = Number(monthRaw);

  const year =
    Number.isFinite(parsedYear) && parsedYear > 0
      ? parsedYear
      : today.getFullYear();
  const month =
    Number.isFinite(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12
      ? parsedMonth
      : today.getMonth() + 1;

  return { year, month };
}
