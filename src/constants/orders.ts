import {
  ALL_STATUS,
  ORDER_STATUS,
  type OrderStatusFilter,
} from '@/types/tableOrders.types';

export const DEFAULT_ORDER_STATUS_FILTER: OrderStatusFilter = ORDER_STATUS.NEW;

export const ORDER_STATUS_OPTIONS = [
  { label: 'New', value: ORDER_STATUS.NEW },
  { label: 'Processing', value: ORDER_STATUS.PROCESSING },
  { label: 'Shipping', value: ORDER_STATUS.SHIPPING },
  { label: 'Completed', value: ORDER_STATUS.COMPLETED },
  { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  { label: 'All', value: ALL_STATUS },
] as const;
