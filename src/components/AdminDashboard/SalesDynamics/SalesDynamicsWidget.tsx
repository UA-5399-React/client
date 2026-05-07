import { useMemo, useRef, useState } from 'react';

import { type FilterState, SalesDynamicsFilter } from '@/components';
import { GroupBy } from '@/constants/salesDynamics';
import { useSalesDynamics } from '@/hooks/useSalesDynamics';
import type { GroupByType } from '@/types/salesDynamics';

import { GROUP_BY_OPTIONS } from './constants';
import { SalesDynamicsChart } from './SalesDynamicsChart';

interface SalesDynamicsWidgetProps {
  className?: string;
}

function toISODate(date: Date): string {
  return date.toISOString().split('T')[0];
}

function getDatesForGroupBy(groupBy: GroupByType) {
  const to = new Date();
  const from = new Date();

  if (groupBy === GroupBy.DAY) {
    from.setDate(from.getDate() - 7);
  } else if (groupBy === GroupBy.WEEK) {
    from.setDate(from.getDate() - 70);
  } else if (groupBy === GroupBy.MONTH) {
    from.setMonth(from.getMonth() - 12);
  }

  return { dateFrom: toISODate(from), dateTo: toISODate(to) };
}

function defaultFilter(): FilterState {
  const initialDates = getDatesForGroupBy(GroupBy.MONTH);

  return {
    ...initialDates,
    categoryId: '',
    productId: '',
    productName: '',
  };
}

export function SalesDynamicsWidget({
  className = '',
}: SalesDynamicsWidgetProps) {
  const filterBtnRef = useRef<HTMLDivElement>(null);

  const [filterOpen, setFilterOpen] = useState(false);
  const [compareFilterOpen, setCompareFilterOpen] = useState(false);
  const [groupBy, setGroupBy] = useState<GroupByType>(GroupBy.MONTH);

  const [appliedFilter, setAppliedFilter] =
    useState<FilterState>(defaultFilter);
  const [compareFilter, setCompareFilter] =
    useState<FilterState>(defaultFilter);
  const [hasCompare, setHasCompare] = useState(false);

  const productIds = useMemo(() => {
    const ids: string[] = [];
    if (appliedFilter.productId) ids.push(appliedFilter.productId);
    if (hasCompare && compareFilter.productId)
      ids.push(compareFilter.productId);
    return ids;
  }, [appliedFilter, compareFilter, hasCompare]);

  const productLabels = useMemo(() => {
    const map: Record<string, string> = {};
    if (appliedFilter.productId)
      map[appliedFilter.productId] = appliedFilter.productName ?? '';
    if (hasCompare && compareFilter.productId)
      map[compareFilter.productId] = compareFilter.productName ?? '';
    return map;
  }, [appliedFilter, compareFilter, hasCompare]);

  const queryVars = useMemo(
    () =>
      productIds.length > 0
        ? {
            productIds,
            from: new Date(appliedFilter.dateFrom).toISOString(),
            to: new Date(`${appliedFilter.dateTo}T23:59:59`).toISOString(),
            groupBy,
          }
        : null,
    [productIds, appliedFilter.dateFrom, appliedFilter.dateTo, groupBy],
  );

  const { data, loading } = useSalesDynamics(queryVars);
  const points = data?.salesDynamics ?? [];

  const handleApplyFilter = (f: FilterState) => {
    setAppliedFilter(f);
    setFilterOpen(false);

    if (!f.productId) {
      setHasCompare(false);
      setCompareFilter(defaultFilter());
    }
  };

  const handleResetAll = () => {
    setAppliedFilter(defaultFilter());
    setHasCompare(false);
    setCompareFilter(defaultFilter());
    setFilterOpen(false);
    setGroupBy(GroupBy.MONTH);
  };

  const handleApplyCompare = (f: FilterState) => {
    setCompareFilter(f);
    setHasCompare(true);
    setCompareFilterOpen(false);
  };

  const handleGroupByChange = (newGroupBy: GroupByType) => {
    setGroupBy(newGroupBy);
    const newDates = getDatesForGroupBy(newGroupBy);
    setAppliedFilter((prev) => ({
      ...prev,
      dateFrom: newDates.dateFrom,
      dateTo: newDates.dateTo,
    }));
  };

  return (
    <div
      className={`flex flex-col gap-4 rounded-2xl bg-white p-5 ${className}`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          {appliedFilter.productName && (
            <div className="flex items-center gap-3">
              <p className="flex flex-wrap items-center gap-1.5 text-[14px] font-semibold">
                <span className="text-blue-500">
                  {appliedFilter.productName}
                </span>
                {hasCompare && compareFilter.productName && (
                  <>
                    <span className="text-[12px] font-normal text-slate-400">
                      VS
                    </span>
                    <span className="text-amber-500">
                      {compareFilter.productName}
                    </span>
                  </>
                )}
              </p>

              <button
                onClick={handleResetAll}
                className="flex h-7 cursor-pointer items-center justify-center rounded-md border border-slate-200 bg-white px-3 text-[12px] font-medium text-slate-600 transition-all outline-none hover:border-red-300 hover:bg-red-50 hover:text-red-500"
                title="Clear entire chart"
              >
                Clear chart
              </button>
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            {GROUP_BY_OPTIONS.map((opt) => {
              const isActive = groupBy === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => handleGroupByChange(opt.value)}
                  className={`flex h-9 cursor-pointer items-center justify-center rounded-lg border px-4 text-[13px] font-medium transition-all outline-none ${
                    isActive
                      ? 'border-blue-500 bg-white text-blue-500 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-400'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <div className="relative" ref={filterBtnRef}>
            <button
              onClick={() => setFilterOpen((p) => !p)}
              className={`flex h-9 cursor-pointer items-center justify-center gap-2 rounded-lg border px-4 text-[13px] font-medium transition-all outline-none ${
                filterOpen || appliedFilter.productId
                  ? 'border-blue-500 bg-white text-blue-500 shadow-sm'
                  : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300 hover:text-blue-400'
              }`}
            >
              {appliedFilter.productId ? 'Change Product' : 'Select Product'}
            </button>

            {filterOpen && (
              <SalesDynamicsFilter
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                onApply={handleApplyFilter}
                initial={appliedFilter}
              />
            )}
          </div>

          {appliedFilter.productId && !hasCompare && (
            <div className="relative">
              <button
                onClick={() => setCompareFilterOpen((p) => !p)}
                className="flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 text-[13px] font-medium whitespace-nowrap text-slate-600 transition-all hover:border-blue-400 hover:bg-blue-50/40 hover:text-blue-500"
              >
                <span className="text-base leading-none text-blue-500">+</span>
                Add compare product
              </button>
              {compareFilterOpen && (
                <SalesDynamicsFilter
                  isOpen={compareFilterOpen}
                  onClose={() => setCompareFilterOpen(false)}
                  onApply={handleApplyCompare}
                  initial={compareFilter}
                  isCompareMode={true}
                />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="relative h-80">
        <SalesDynamicsChart
          points={points}
          productIds={productIds}
          productLabels={productLabels}
          loading={loading}
        />
      </div>
    </div>
  );
}
