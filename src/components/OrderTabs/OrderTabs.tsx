import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import {
  DEFAULT_ORDER_STATUS_FILTER,
  ORDER_STATUS_OPTIONS,
  type OrderStatusFilter,
} from '@/constants/orders';

interface OrderTabsProps {
  counts: Record<string, number>;
}

export function OrderTabs({ counts }: OrderTabsProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentStatus =
    (searchParams.get('status') as OrderStatusFilter) ||
    DEFAULT_ORDER_STATUS_FILTER;

  const handleTabChange = (value: OrderStatusFilter) => {
    const newParams = new URLSearchParams(searchParams);

    if (value === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', value);
    }

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="no-scrollbar mb-6 flex items-center gap-2 overflow-x-auto">
      {ORDER_STATUS_OPTIONS.map((tab) => {
        const isActive = currentStatus === tab.value;
        const count = counts[tab.value] || 0;

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={clsx(
              'rounded-lg px-4 py-1.5 text-sm font-medium whitespace-nowrap transition-all',
              isActive
                ? 'bg-[#2563EB] text-white shadow-sm'
                : 'bg-transparent text-gray-400 hover:bg-white/5 hover:text-white',
            )}
          >
            {tab.label} <span className="ml-1 opacity-70">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
