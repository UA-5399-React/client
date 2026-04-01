import type React from 'react';
import { House, Package, Truck } from 'lucide-react';

import type { Order, ProgressStep } from '@/types/order.types';

export const STEPS: {
  key: Exclude<ProgressStep, 'new'>;
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
}[] = [
  { key: 'processed', label: 'Processed', Icon: Package },
  { key: 'shipped', label: 'En Route', Icon: Truck },
  { key: 'completed', label: 'Completed', Icon: House },
];

export const STEP_INDEX: Record<ProgressStep, number> = {
  new: -1,
  processed: 0,
  shipped: 1,
  completed: 2,
};

export const STATUS_LABELS: Record<Order['status'], string> = {
  new: 'New',
  processed: 'In progress',
  shipped: 'In progress',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

export const IN_PROGRESS_STATUSES = new Set<Order['status']>([
  'new',
  'processed',
  'shipped',
]);

export const PENDING_STATUSES = new Set<Order['status']>([
  'new',
  'processed',
  'shipped',
]);
