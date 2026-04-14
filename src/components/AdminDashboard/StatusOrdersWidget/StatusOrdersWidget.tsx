import { useNavigate } from 'react-router-dom';

import { useOrdersStatusStats } from '@/hooks/useOrdersStatusStats';

import { StatusOrdersChart } from './StatusOrdersChart';
import { StatusOrdersLegend } from './StatusOrdersLegend';

const StatusOrdersSkeleton = () => (
  <div className="flex animate-pulse flex-col items-center gap-6 py-2">
    <div
      className="relative flex items-center justify-center"
      style={{ width: 280, height: 280 }}
    >
      <div className="size-full rounded-full bg-gray-200" />
      <div className="absolute size-[60%] rounded-full bg-white" />
    </div>
    <div className="flex gap-12">
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        {[1, 2].map((i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="size-2.5 rounded-full bg-gray-200" />
            <div className="h-3 w-20 rounded bg-gray-200" />
          </div>
        ))}
      </div>
    </div>
    <div className="h-9 w-32 rounded-full bg-gray-200" />
  </div>
);

export const StatusOrdersWidget = () => {
  const navigate = useNavigate();
  const { data, isLoading, error } = useOrdersStatusStats();

  if (isLoading) return <StatusOrdersSkeleton />;
  if (error || !data)
    return <div className="text-sm text-red-400">Error loading data</div>;

  return (
    <div className="flex flex-col items-center gap-6 py-2">
      <StatusOrdersChart data={data} />
      <StatusOrdersLegend statuses={data.statuses} />

      <button
        onClick={() => navigate('/admin/orders')}
        className="cursor-pointer rounded-full border border-blue-500 px-10 py-2 text-sm text-blue-500 transition hover:bg-blue-50"
      >
        Show all
      </button>
    </div>
  );
};
