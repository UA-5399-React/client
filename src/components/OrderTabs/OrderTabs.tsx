import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';

import {
  DEFAULT_ORDER_STATUS_FILTER,
  ORDER_STATUS_OPTIONS,
} from '@/constants/orders';
import type { OrderStatusFilter } from '@/types/tableOrders.types';

export function OrderTabs() {
  const [searchParams, setSearchParams] = useSearchParams();

  const statusFromUrl = searchParams.get('status')?.toLowerCase() as
    | OrderStatusFilter
    | undefined;

  const currentStatus = statusFromUrl || DEFAULT_ORDER_STATUS_FILTER;

  const handleTabChange = (value: string) => {
    const newParams = new URLSearchParams(searchParams);

    newParams.set('status', value.toLowerCase());

    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  return (
    <div className="no-scrollbar mb-8 flex items-center gap-4 overflow-x-auto pb-2">
      {ORDER_STATUS_OPTIONS.map((tab) => {
        const isActive = currentStatus === tab.value.toLowerCase();

        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => handleTabChange(tab.value)}
            className={clsx(
              'cursor-pointer border-none px-6 py-2.5 text-sm font-semibold whitespace-nowrap transition-all duration-300 ease-in-out focus:outline-none',
              isActive
                ? 'rounded-xl bg-[#437EF7] text-white shadow-md'
                : 'rounded-xl bg-transparent text-[#5E6366] hover:bg-gray-50/50 hover:text-[#2C2C2C]',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
