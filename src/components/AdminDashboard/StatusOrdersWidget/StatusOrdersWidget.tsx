import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { Button } from '@/components/Button';
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

  const statusesWithPercentage = useMemo(() => {
    if (!data) return [];

    return data.statuses.map((s) => ({
      ...s,
      percentage: data.total > 0 ? Math.round((s.count / data.total) * 100) : 0,
    }));
  }, [data]);

  if (isLoading) return <StatusOrdersSkeleton />;
  if (error || !data)
    return (
      <div className="flex h-full min-h-40 items-center justify-center text-center text-sm text-red-400">
        Something went wrong, please try again later.
      </div>
    );

  return (
    <div className="flex flex-col items-center gap-6 py-4">
      <StatusOrdersChart data={{ ...data, statuses: statusesWithPercentage }} />
      <StatusOrdersLegend statuses={statusesWithPercentage} />

      <Button
        onClick={() => navigate('/admin/orders')}
        className="rounded-full border! border-blue-500! bg-transparent p-2 text-sm font-medium text-blue-500 transition-colors hover:bg-blue-500/10"
      >
        Show all
      </Button>
    </div>
  );
};
