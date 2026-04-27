import { useMemo, useState } from 'react';

import { MainTable, Switcher } from '@/components';
import { QUANTITY, REVENUE } from '@/constants/general';
import { useAbcAnalysis } from '@/hooks/useAbcAnalysis';
import type { Column } from '@/types';
import type {
  AbcAnalysisSummary,
  AbcBucket,
  AbcMetricEnum,
} from '@/types/statistic.types';

type MetricMode = typeof QUANTITY | typeof REVENUE;

type ABCAnalysisRow = {
  id: string;
  codeProduct: string;
  product: string;
  value: number;
  percentageByTotal: number;
  cumulativePercentage: number;
  classType: AbcBucket;
};

const CLASS_STYLES: Record<ABCAnalysisRow['classType'], string> = {
  A: 'bg-green-100 text-green-700 border border-green-700',
  B: 'bg-amber-100 text-amber-700 border border-amber-700',
  C: 'bg-red-100 text-red-700 border border-red-700',
};

const formatValue = (value: number, mode: MetricMode) =>
  mode === QUANTITY
    ? `${value.toLocaleString('en-GB')} pcs`
    : `$${value.toFixed(2)}`;

const formatPercent = (value: number) => `${value.toFixed(1)}%`;

const toMetricEnum = (mode: MetricMode): AbcMetricEnum =>
  mode === QUANTITY ? 'UNITS' : 'REVENUE';

export function ABCAnalysisTable() {
  const [metricMode, setMetricMode] = useState<MetricMode>(REVENUE);
  const { items, summary, loading, error } = useAbcAnalysis({
    metric: toMetricEnum(metricMode),
  });

  const columns = useMemo<Column[]>(
    () => [
      { key: 'codeProduct', label: 'Code Product', className: 'text-left' },
      { key: 'product', label: 'Product', className: 'text-left' },
      {
        key: 'quantityOrRevenue',
        label: metricMode === QUANTITY ? 'Quantity' : 'Revenue',
        className: 'text-left',
      },
      {
        key: 'salesPercent',
        label: 'Sales.%',
        className: 'text-left',
      },
      { key: 'class', label: 'Class', className: 'text-center' },
    ],
    [metricMode],
  );

  const rows = useMemo<ABCAnalysisRow[]>(
    () =>
      items.map((item) => ({
        id: item.productCode ?? item.productName,
        codeProduct: item.productCode ?? '-',
        product: item.productName,
        value: item.value,
        percentageByTotal: item.percentageByTotal,
        cumulativePercentage: item.cumulativePercentage,
        classType: item.bucket,
      })),
    [items],
  );

  const renderRow = (item: ABCAnalysisRow) => (
    <>
      <td className="text-left text-sm text-gray-600">{item.codeProduct}</td>
      <td className="text-left text-sm text-gray-800">{item.product}</td>
      <td className="text-left text-sm text-gray-700">
        {formatValue(item.value, metricMode)}
      </td>
      <td className="text-left text-sm text-gray-700">
        {formatPercent(item.percentageByTotal)}
      </td>
      <td className="text-center">
        <span
          className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${CLASS_STYLES[item.classType]}`}
        >
          {item.classType}
        </span>
      </td>
    </>
  );

  const renderSummary = (summary: AbcAnalysisSummary) => {
    return (
      <>
        <div className="pr-2 text-right text-sm font-bold text-gray-700">
          <p>Total: {summary?.totalValue}</p>
        </div>
      </>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex justify-end pr-5">
        <Switcher
          isRightActive={metricMode === REVENUE}
          leftLabel="Count"
          rightLabel="Revenue"
          onToggle={() =>
            setMetricMode((prevMode) =>
              prevMode === REVENUE ? QUANTITY : REVENUE,
            )
          }
          ariaLabel="Toggle between quantity and revenue"
        />
      </div>

      <MainTable
        columns={columns}
        items={rows}
        loading={loading}
        error={error}
        emptyMessage="No ABC analysis data found"
        renderRow={(item) => renderRow(item)}
        summary={summary ? renderSummary(summary) : null}
      />
    </div>
  );
}
