import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import { Button } from '@/components/Button';
import type { Order, ProgressStep } from '@/types/order.types';

import {
  IN_PROGRESS_STATUSES,
  PENDING_STATUSES,
  STATUS_LABELS,
} from './constants';
import { OrderProgressBar } from './OrderProgressBar/OrderProgressBar';

interface OrderCardProps {
  order: Order;
}

const formatDate = (date: string | undefined, status: Order['status']) => {
  if (!date) return '—';
  return PENDING_STATUSES.has(status) ? `Exp. ${date}` : date;
};

export const OrderCard = ({ order }: OrderCardProps) => {
  const { id, orderNumber, createdAt, status, totalPrice } = order;
  const navigate = useNavigate();
  const isInProgress = IN_PROGRESS_STATUSES.has(status);
  const handleDetails = () => navigate(`/order/${id}`);

  return (
    <div className="border-b border-[rgb(var(--color-border,226,226,226))] py-6 last:border-b-0 dark:border-gray-700">
      <div className="hidden grid-cols-[150px_180px_140px_1fr_140px] items-center md:grid">
        <span className="text-sm text-[rgb(var(--color-text))]">
          {orderNumber}
        </span>
        <span className="text-sm text-[rgb(var(--color-text))]">
          {formatDate(createdAt, status)}
        </span>
        <span className="text-sm font-medium text-[rgb(var(--color-text))]">
          {STATUS_LABELS[status]}
        </span>
        <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
          ${totalPrice.toFixed(2)}
        </span>
        {!isInProgress ? (
          <div className="flex justify-end">
            {/*<Button
              onClick={handleDetails}
              className="flex items-center gap-2 rounded-md bg-[rgb(var(--color-bg-sec-inverted))] px-5 py-2.5 text-sm font-medium text-[rgb(var(--color-text-inverted))] transition-all duration-200 hover:opacity-80 active:scale-95"
            >
              Details <ArrowRight className="h-4 w-4" />
            </Button>*/}
          </div>
        ) : (
          <span />
        )}
      </div>

      <div className="flex items-start justify-between gap-2 md:hidden">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
            {orderNumber}
          </span>
          <span className="text-xs text-gray-500">
            {formatDate(createdAt, status)}
          </span>
          <span className="text-xs font-medium text-[rgb(var(--color-text))]">
            {STATUS_LABELS[status]}
          </span>
          <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
        {!isInProgress && (
          <Button
            onClick={handleDetails}
            className="flex shrink-0 items-center gap-1 rounded-md bg-[rgb(var(--color-bg-sec-inverted))] px-3 py-2 text-xs font-medium text-[rgb(var(--color-text-inverted))] transition-all duration-200 hover:opacity-80 active:scale-95"
          >
            Details <ArrowRight className="h-3 w-3" />
          </Button>
        )}
      </div>

      {isInProgress && (
        <div className="mt-6 flex flex-col items-center gap-5">
          <div className="w-full max-w-[500px]">
            <OrderProgressBar currentStep={status as ProgressStep} />
          </div>
          {/*<Button
            onClick={handleDetails}
            className="flex items-center gap-2 rounded-md bg-[rgb(var(--color-bg-sec-inverted))] px-5 py-2.5 text-sm font-medium text-[rgb(var(--color-text-inverted))] transition-all duration-200 hover:opacity-80 active:scale-95"
          >
            Details <ArrowRight className="h-4 w-4" />
          </Button>*/}
        </div>
      )}
    </div>
  );
};
