import type { OrderStatus } from '@/types/tableOrders.types';
import { ORDER_STATUS } from '@/types/tableOrders.types';

export type OrderStatusFilter = OrderStatus | 'all';

export const DEFAULT_ORDER_STATUS_FILTER: OrderStatusFilter = 'all';

export const ORDER_STATUS_OPTIONS = [
  { label: 'New', value: ORDER_STATUS.NEW },
  { label: 'Processing', value: ORDER_STATUS.PROCESSING },
  { label: 'Shipping', value: ORDER_STATUS.SHIPPING },
  { label: 'Completed', value: ORDER_STATUS.COMPLETED },
  { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  { label: 'All', value: 'all' },
] as const;
