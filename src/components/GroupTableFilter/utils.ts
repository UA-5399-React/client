import type { GroupTableFilterState } from './GroupTableFilter';

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

export const emptyGroupFilter = (): GroupTableFilterState => {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return { dateFrom: toISODate(from), dateTo: toISODate(to) };
};
