import { CheckCircle2, ClipboardList, Package, XCircle } from 'lucide-react';

import { ORDER_STATUS } from '@/types/tableOrders.types';

interface OrdersTopWidgetsProps {
  counts: {
    [key in (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS]]?: number;
  } & { all?: number };
  loading: boolean;
}

export function OrdersTopWidgets({ counts, loading }: OrdersTopWidgetsProps) {
  const widgetItems = [
    {
      id: 'total',
      label: 'Total New Orders',
      value: counts[ORDER_STATUS.NEW] || 0,
      icon: ClipboardList,
      color: 'text-emerald-500',
      borderColor: 'border-emerald-500',
    },
    {
      id: 'completed',
      label: 'Completed',
      value: counts[ORDER_STATUS.COMPLETED] || 0,
      icon: CheckCircle2,
      color: 'text-blue-500',
      borderColor: 'border-blue-500',
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      value: counts[ORDER_STATUS.CANCELLED] || 0,
      icon: XCircle,
      color: 'text-rose-500',
      borderColor: 'border-rose-500',
    },
    {
      id: 'processing',
      label: 'Processing',
      value: counts[ORDER_STATUS.PROCESSING] || 0,
      icon: Package,
      color: 'text-amber-500',
      borderColor: 'border-amber-500',
    },
  ];

  return (
    <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {widgetItems.map((item) => {
        const Icon = item.icon;

        return (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FB] p-6 shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative flex h-14 w-14 items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[3px] border-[#E5E7EB]"></div>

              <div
                className={`absolute inset-0 -rotate-45 rounded-full border-[3px] border-t-transparent border-r-transparent ${item.borderColor}`}
              ></div>

              <Icon className={`h-6 w-6 ${item.color}`} strokeWidth={2} />
            </div>

            <div className="flex flex-col items-end text-right">
              <p className="mb-1 text-sm font-medium text-[#A0AEC0]">
                {item.label}
              </p>
              <p className="text-3xl font-bold text-[#2D3748]">
                {loading ? '...' : item.value}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
