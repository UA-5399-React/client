import { ORDER, PAGE_LIMIT, SORT } from './general';

export const ORDERS_QUERY = {
  page: PAGE_LIMIT,
  limit: PAGE_LIMIT,
  sort: SORT,
  order: ORDER,
} as const;
