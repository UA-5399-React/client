import type { OrderStatus } from '@/types/order.types';

export type OrderStatusFilter = OrderStatus | 'all';

export const DEFAULT_ORDER_STATUS_FILTER: OrderStatusFilter = 'new';

export const ORDER_STATUS_OPTIONS = [
  { label: 'New', value: 'new' },
  { label: 'Processing', value: 'processed' },
  { label: 'Shipping', value: 'shipped' },
  { id: 'completed', label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'All', value: 'all' },
] as const;
