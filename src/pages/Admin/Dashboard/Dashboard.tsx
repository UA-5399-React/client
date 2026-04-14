import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useUserStats } from '@/hooks/useUserStats';
import { getCurrentMonthPeriod } from '@/utils';

import { UsersChart } from '../UsersChart/UsersChart';
type DashboardCardProps = {
  title: string;
  slotName: string;
  className?: string;
};

function DashboardCard({ title, className = '' }: DashboardCardProps) {
  return (
    <section
      className={`bg-background rounded-2xl border border-gray-300 p-4 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-text text-xs font-bold tracking-[0.08em] uppercase">
          {title}
        </h2>
      </div>

      <div className="bg-backgroundSec flex min-h-48 items-center justify-center rounded-2xl border border-gray-300 px-6 py-8 text-center"></div>
    </section>
  );
}

export function Dashboard() {
  const navigate = useNavigate();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthPeriod());

  const handleShowAll = () => {
    navigate(ROUTES.ADMIN_USERS);
  };

  const {
    dailyCounts,
    registrationsThisMonth,
    highlightBarIndex,
    dateLabel,
    loading: periodLoading,
    error: periodError,
  } = useUserStats(selectedPeriod);

  return (
    <div>
      <section className="bg-background text-text min-h-screen px-4 py-6 transition-colors duration-300 md:px-6">
        <div className="mx-auto space-y-3">
          <div className="grid gap-3 xl:grid-cols-2">
            <DashboardCard
              title="Status Orders"
              slotName="<OrderStatusChart />"
            />
            <UsersChart
              registrationsThisMonth={registrationsThisMonth}
              dailyCounts={dailyCounts}
              dateLabel={dateLabel}
              highlightBarIndex={highlightBarIndex}
              selectedPeriod={selectedPeriod}
              onPeriodChange={setSelectedPeriod}
              loading={periodLoading}
              error={periodError}
              onShowAll={handleShowAll}
            />
          </div>

          <DashboardCard
            title="Number of Sales"
            slotName="<SalesChart />"
            className="min-h-[320px]"
          />

          <DashboardCard
            title="ABC Analysis"
            slotName="<ABCTable />"
            className="min-h-[300px]"
          />
        </div>
      </section>
    </div>
  );
}
