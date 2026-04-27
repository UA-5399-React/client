import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  ABCAnalysisTable,
  Dropdown,
  type DropdownOption,
  GroupTable,
  StatusOrdersWidget,
} from '@/components';
import { ROUTES } from '@/constants';
import { CATEGORY, DAY, PRODUCT } from '@/constants/general';
import { useAuth } from '@/hooks/useAuth';
import { useGroupByTable } from '@/hooks/useGroupByTable';
import { useUserStats } from '@/hooks/useUserStats';
import type { GroupByEnum } from '@/types/statistic.types';
import { getCurrentMonthPeriod } from '@/utils';

import { UsersChart } from '../UsersChart/UsersChart';
type DashboardCardProps = {
  title: string;
  className?: string;
  children?: React.ReactNode;
};

const GROUP_BY_OPTIONS = [
  { label: 'Day', value: DAY },
  { label: 'Product', value: PRODUCT },
  { label: 'Category', value: CATEGORY },
];

function DashboardCard({
  title,
  className = '',
  children,
}: DashboardCardProps) {
  return (
    <section
      className={`bg-background rounded-2xl border border-gray-300 ${className}`}
    >
      <div className="mb-4 flex items-start justify-between gap-3 p-4">
        <h2 className="text-text text-base font-bold tracking-[0.08em] uppercase">
          {title}
        </h2>
      </div>

      {children}
    </section>
  );
}
export function Dashboard() {
  const navigate = useNavigate();
  const { isSuperAdmin } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState(getCurrentMonthPeriod());
  const [selectedGroupBy, setSelectedGroupBy] = useState<GroupByEnum>(DAY);

  const {
    dailyCounts,
    registrationsThisMonth,
    highlightBarIndex,
    dateLabel,
    loading: periodLoading,
    error: periodError,
  } = useUserStats(selectedPeriod, isSuperAdmin);

  const { items, loading, error } = useGroupByTable({
    groupBy: selectedGroupBy,
  });

  const handleGroupByChange = (selected: DropdownOption[]) => {
    const nextGroupBy = selected[0]?.value as GroupByEnum | undefined;
    if (!nextGroupBy) return;
    setSelectedGroupBy(nextGroupBy);
  };

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
              onShowAll={
                isSuperAdmin ? () => navigate(ROUTES.ADMIN_USERS) : undefined
              }
            />
          </div>

          <DashboardCard title="ABC Analysis" className="min-h-[300px]">
            <ABCAnalysisTable />
          </DashboardCard>

          <DashboardCard title="Group" className="min-h-[320px]">
            <div className="flex items-center justify-end px-4 pb-4">
              <Dropdown
                options={GROUP_BY_OPTIONS}
                selectedValues={[selectedGroupBy]}
                onChange={(selected) => handleGroupByChange(selected)}
                multiple={false}
                hasBorder={true}
                placeholder="Group by"
                selectClassName="max-w-[180px]"
              />
            </div>

            <GroupTable
              groupBy={selectedGroupBy}
              items={items}
              loading={loading}
              error={error}
            />
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
