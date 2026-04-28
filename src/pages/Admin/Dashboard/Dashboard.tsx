import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { StatusOrdersWidget } from '@/components';
import { SalesDynamicsWidget } from '@/components';
import { ROUTES } from '@/constants';
import { useUserStats } from '@/hooks/useUserStats';
import { getCurrentMonthPeriod } from '@/utils';

import { UsersChart } from '../UsersChart/UsersChart';

type DashboardCardProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

function DashboardCard({
  title,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <section
      className={`bg-background rounded-2xl border border-gray-300 p-4 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <h2 className="text-text text-xs font-bold tracking-[0.08em] uppercase">
          {title}
        </h2>
      </div>

      {children}
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
            <DashboardCard title="Status Orders">
              <StatusOrdersWidget />
            </DashboardCard>

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

          <DashboardCard title="Number of Sales" className="min-h-[320px]">
            <SalesDynamicsWidget />
          </DashboardCard>

          <DashboardCard
            title="ABC Analysis"
            className="min-h-[300px]"
          ></DashboardCard>
        </div>
      </section>
    </div>
  );
}
