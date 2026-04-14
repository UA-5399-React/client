import { CheckCircle2, ClipboardList, Package, XCircle } from 'lucide-react';

import { type ALL_STATUS, ORDER_STATUS } from '@/types/tableOrders.types';

interface OrdersTopWidgetsProps {
  counts: {
    [key in (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]]?: number;
  } & { [ALL_STATUS]?: number };
  loading: boolean;
}

export function OrdersTopWidgets({ counts, loading }: OrdersTopWidgetsProps) {
  const widgetItems = [
    {
      id: ORDER_STATUS.NEW,
      label: 'Total New Orders',
      value: counts[ORDER_STATUS.NEW] || 0,
      icon: ClipboardList,
      color: 'text-emerald-500',
      borderColor: 'border-emerald-500',
    },
    {
      id: ORDER_STATUS.COMPLETED,
      label: 'Completed',
      value: counts[ORDER_STATUS.COMPLETED] || 0,
      icon: CheckCircle2,
      color: 'text-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      id: ORDER_STATUS.CANCELLED,
      label: 'Cancelled',
      value: counts[ORDER_STATUS.CANCELLED] || 0,
      icon: XCircle,
      color: 'text-rose-500',
      borderColor: 'border-rose-500',
    },
    {
      id: ORDER_STATUS.PROCESSING,
      label: 'Processing',
      value: counts[ORDER_STATUS.PROCESSING] || 0,
      icon: Package,
      color: 'text-amber-500',
      borderColor: 'border-amber-500',
    },
  ];

  return (
    <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
      {widgetItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FB] p-3 shadow-sm transition-all hover:shadow-md sm:p-6"
          >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center sm:h-14 sm:w-14">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#E5E7EB]"></div>

              <div
                className={`absolute inset-0 -rotate-45 rounded-full border-[3px] border-t-transparent border-r-transparent ${item.borderColor}`}
              ></div>

              <Icon
                className={`h-4 w-4 sm:h-6 sm:w-6 ${item.color}`}
                strokeWidth={2}
              />
            </div>

            <div className="flex flex-col items-end text-right">
              <p className="mb-1 text-xs font-medium text-[#A0AEC0] sm:text-sm">
                {item.label}
              </p>
              <p className="text-xl font-bold text-[#2D3748] sm:text-3xl">
                {loading ? '...' : item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
