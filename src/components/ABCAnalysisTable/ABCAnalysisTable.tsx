import { useMemo, useState } from 'react';

import { MainTable, Switcher } from '@/components';
import { QUANTITY, REVENUE } from '@/constants/general';
import type { Column } from '@/types';

type MetricMode = typeof QUANTITY | typeof REVENUE;

type ABCAnalysisItem = {
  id: string;
  codeProduct: string;
  product: string;
  quantity: string;
  revenue: string;
  salesPercent: string;
  salesRevenuePercent: string;
  classType: 'A' | 'B' | 'C';
};

const MOCK_ABC_ANALYSIS_ITEMS: ABCAnalysisItem[] = [
  {
    id: '1',
    codeProduct: '#69G4S0Q',
    product: 'Laptop',
    quantity: '100 pcs',
    revenue: '$4000',
    salesPercent: '14.5%',
    salesRevenuePercent: '15.4%',
    classType: 'A',
  },
  {
    id: '2',
    codeProduct: '#69G4S0Q',
    product: 'Laptop',
    quantity: '100 pcs',
    revenue: '$4000',
    salesPercent: '14.5%',
    salesRevenuePercent: '15.4%',
    classType: 'A',
  },
  {
    id: '3',
    codeProduct: '#69G4S0Q',
    product: 'Laptop',
    quantity: '100 pcs',
    revenue: '$4000',
    salesPercent: '14.5%',
    salesRevenuePercent: '15.4%',
    classType: 'B',
  },
  {
    id: '4',
    codeProduct: '#69G4S0Q',
    product: 'Laptop',
    quantity: '100 pcs',
    revenue: '$4000',
    salesPercent: '14.5%',
    salesRevenuePercent: '15.4%',
    classType: 'C',
  },
  {
    id: '5',
    codeProduct: '#69G4S0Q',
    product: 'Laptop',
    quantity: '100 pcs',
    revenue: '$4000',
    salesPercent: '14.5%',
    salesRevenuePercent: '15.4%',
    classType: 'C',
  },
];

const CLASS_STYLES: Record<ABCAnalysisItem['classType'], string> = {
  A: 'bg-green-100 text-green-700',
  B: 'bg-amber-100 text-amber-700',
  C: 'bg-red-100 text-red-700',
};

export function ABCAnalysisTable() {
  const [metricMode, setMetricMode] = useState<MetricMode>(REVENUE);

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
        label: metricMode === QUANTITY ? 'Sales.%' : 'Sales,%',
        className: 'text-left',
      },
      { key: 'class', label: 'Class', className: 'text-center' },
    ],
    [metricMode],
  );

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
        items={MOCK_ABC_ANALYSIS_ITEMS}
        renderRow={(item) => (
          <>
            <td className="text-left text-sm text-gray-600">
              {item.codeProduct}
            </td>
            <td className="text-left text-sm text-gray-800">{item.product}</td>
            <td className="text-left text-sm text-gray-700">
              {metricMode === QUANTITY ? item.quantity : item.revenue}
            </td>
            <td className="text-left text-sm text-gray-700">
              {metricMode === QUANTITY
                ? item.salesPercent
                : item.salesRevenuePercent}
            </td>
            <td className="text-center">
              <span
                className={`inline-flex h-6 w-6 items-center justify-center rounded-md text-xs font-semibold ${CLASS_STYLES[item.classType]}`}
              >
                {item.classType}
              </span>
            </td>
          </>
        )}
      />
    </div>
  );
}
