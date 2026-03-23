import type { Order } from '@/types/order.types';

export const STATUS_LABELS: Record<Order['status'], string> = {
  new: 'New',
  processing: 'In progress',
  shipping: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const IN_PROGRESS_STATUSES = new Set<Order['status']>([
  'processing',
  'shipping',
]);

export const PENDING_STATUSES = new Set<Order['status']>([
  'new',
  'processing',
  'shipping',
]);
