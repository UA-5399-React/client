import { GroupBy } from '@/constants/salesDynamics';
import type { GroupByType } from '@/types/salesDynamics';

export const GROUP_BY_OPTIONS: { label: string; value: GroupByType }[] = [
  { label: 'Day', value: GroupBy.DAY },
  { label: 'Week', value: GroupBy.WEEK },
  { label: 'Month', value: GroupBy.MONTH },
];

export const MAX_PRODUCTS = 2;

export const DEFAULT_DAYS_BACK = 30;
