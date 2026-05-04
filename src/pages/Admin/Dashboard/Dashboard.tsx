import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Filter } from 'lucide-react';

import {
  ABCAnalysisTable,
  Dropdown,
  type DropdownOption,
  GroupTable,
  Pagination,
  SalesDynamicsWidget,
  StatusOrdersWidget,
} from '@/components';
import {
  GroupTableFilter,
  type GroupTableFilterState,
} from '@/components/GroupTableFilter';
import { emptyGroupFilter } from '@/components/GroupTableFilter';
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
  headerRight?: React.ReactNode;
};

const GROUP_BY_OPTIONS = [
  { label: 'Day', value: DAY },
  { label: 'Product', value: PRODUCT },
  { label: 'Category', value: CATEGORY },
];

const GROUP_TABLE_LIMIT = 10;

function DashboardCard({
  title,
  className = '',
  children,
  headerRight,
}: DashboardCardProps) {
  return (
    <section
      className={`bg-background rounded-2xl border border-gray-300 ${className}`}
    >
      <div className="mb-4 flex items-center justify-between gap-3 p-4">
        <h2 className="text-text text-base font-bold tracking-[0.08em] uppercase">
          {title}
        </h2>
        {headerRight}
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
  const [groupTablePage, setGroupTablePage] = useState(1);

  const [filterOpen, setFilterOpen] = useState(false);
  const [groupFilter, setGroupFilter] =
    useState<GroupTableFilterState>(emptyGroupFilter);

  const defaultFilter = emptyGroupFilter();
  const isFilterActive =
    groupFilter.dateFrom !== defaultFilter.dateFrom ||
    groupFilter.dateTo !== defaultFilter.dateTo;

  const {
    dailyCounts,
    registrationsThisMonth,
    highlightBarIndex,
    dateLabel,
    loading: periodLoading,
    error: periodError,
  } = useUserStats(selectedPeriod, isSuperAdmin);

  const {
    items,
    summary: groupSummary,
    loading,
    error,
    page,
    totalPages,
  } = useGroupByTable({
    groupBy: selectedGroupBy,
    dateFrom: groupFilter.dateFrom,
    dateTo: groupFilter.dateTo,
    page: groupTablePage,
    limit: GROUP_TABLE_LIMIT,
  });

  const handleGroupByChange = (selected: DropdownOption[]) => {
    const nextGroupBy = selected[0]?.value as GroupByEnum | undefined;
    if (!nextGroupBy) return;

    setSelectedGroupBy(nextGroupBy);
    setGroupTablePage(1);
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

          <DashboardCard title="Number of Sales" className="min-h-[320px]">
            <SalesDynamicsWidget />
          </DashboardCard>

          <DashboardCard title="ABC Analysis" className="min-h-[300px]">
            <ABCAnalysisTable />
          </DashboardCard>

          <DashboardCard title="Group" className="min-h-[320px]">
            <div className="mb-4 flex items-center justify-between px-4">
              <div className="relative">
                <button
                  onClick={() => setFilterOpen((o) => !o)}
                  className={`flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[13px] transition-colors ${
                    isFilterActive
                      ? 'border-blue-500 bg-blue-50 text-blue-600'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'
                  }`}
                >
                  <Filter size={14} strokeWidth={1.5} />
                  Filter
                  {isFilterActive && (
                    <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-blue-500" />
                  )}
                </button>

                <GroupTableFilter
                  isOpen={filterOpen}
                  onClose={() => setFilterOpen(false)}
                  onApply={setGroupFilter}
                  initial={groupFilter}
                />
              </div>

              <div className="flex items-center gap-3">
                <Dropdown
                  options={GROUP_BY_OPTIONS}
                  selectedValues={[selectedGroupBy]}
                  onChange={handleGroupByChange}
                  multiple={false}
                  hasBorder={true}
                  placeholder="Group by"
                  selectClassName="max-w-[180px]"
                />
              </div>
            </div>

            <GroupTable
              summary={groupSummary}
              groupBy={selectedGroupBy}
              items={items}
              loading={loading}
              error={error}
            />

            {totalPages > 1 && (
              <div className="flex justify-center px-4 py-4">
                <Pagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={setGroupTablePage}
                />
              </div>
            )}
          </DashboardCard>
        </div>
      </section>
    </div>
  );
}
