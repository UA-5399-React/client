import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  buildDailyCountsFromRegistrations,
  formatMonthRange,
  getCurrentMonthPeriod,
  resolvePeriod,
} from './date.utils';

describe('utils: formatMonthRange', () => {
  it('formats a 30-day month range', () => {
    expect(formatMonthRange(2026, 4)).toBe('1 - 30 April 2026');
  });

  it('formats leap-year February correctly', () => {
    expect(formatMonthRange(2024, 2)).toBe('1 - 29 February 2024');
  });
});

describe('utils: buildDailyCountsFromRegistrations', () => {
  it('builds dense daily counts and keeps missing days as zero', () => {
    const rows = [
      { day: 1, count: 2 },
      { day: 3, count: 5 },
      { day: 30, count: 1 },
    ];

    const result = buildDailyCountsFromRegistrations(2026, 4, rows);

    expect(result).toHaveLength(30);
    expect(result[0]).toBe(2);
    expect(result[1]).toBe(0);
    expect(result[2]).toBe(5);
    expect(result[29]).toBe(1);
  });

  it('ignores out-of-range days', () => {
    const rows = [
      { day: 0, count: 9 },
      { day: 32, count: 9 },
      { day: 15, count: 4 },
    ];

    const result = buildDailyCountsFromRegistrations(2026, 1, rows);

    expect(result).toHaveLength(31);
    expect(result[14]).toBe(4);
    expect(result.reduce((sum, value) => sum + value, 0)).toBe(4);
  });
});

describe('utils: period helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('returns current YYYY-MM for getCurrentMonthPeriod', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));

    expect(getCurrentMonthPeriod()).toBe('2026-04');
  });

  it('parses a valid period string', () => {
    expect(resolvePeriod('2025-11')).toEqual({ year: 2025, month: 11 });
  });

  it('falls back to current date for invalid period values', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-04-14T10:00:00.000Z'));

    expect(resolvePeriod('2026-99')).toEqual({ year: 2026, month: 4 });
    expect(resolvePeriod('invalid')).toEqual({ year: 2026, month: 4 });
    expect(resolvePeriod()).toEqual({ year: 2026, month: 4 });
  });
});
