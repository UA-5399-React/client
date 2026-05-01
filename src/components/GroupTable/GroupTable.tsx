import { MainTable } from '@/components';
import type { Column } from '@/types';
import type {
  GroupByEnum,
  SalesByCategoryItem,
  SalesByCategorySummary,
  SalesByDayItem,
  SalesByDaySummary,
  SalesByProductItem,
  SalesByProductSummary,
} from '@/types/statistic.types';
import { formatDateToShort } from '@/utils';

const productColumns: Column[] = [
  { key: 'productCode', label: 'Product Code', className: 'text-left' },
  { key: 'productName', label: 'Product Name' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'revenue', label: 'Revenue' },
];

const dayColumns: Column[] = [
  { key: 'quantity', label: 'Quantity', className: 'text-left' },
  { key: 'revenue', label: 'Revenue' },
  { key: 'ordersCount', label: 'Orders Count' },
  { key: 'averageCheck', label: 'Average' },
  { key: 'date', label: 'Date', className: 'text-left' },
];

const categoryColumns: Column[] = [
  { key: 'category', label: 'Category', className: 'text-left' },
  { key: 'quantity', label: 'Quantity' },
  { key: 'revenue', label: 'Revenue' },
];

const formatRevenue = (value: number) => `$${value.toFixed(2)}`;

interface GroupTableProps {
  groupBy: GroupByEnum;
  items: SalesByProductItem[] | SalesByDayItem[] | SalesByCategoryItem[];
  loading: boolean;
  error: Error | null | undefined;
  summary:
    | SalesByProductSummary
    | SalesByDaySummary
    | SalesByCategorySummary
    | null;
}

export function GroupTable({
  summary,
  groupBy,
  items,
  loading,
  error,
}: GroupTableProps) {
  const isDayGroup = groupBy === 'DAY';
  const isCategoryGroup = groupBy === 'CATEGORY';

  const rows = isDayGroup
    ? (items as SalesByDayItem[]).map((item) => ({ ...item, id: item.date }))
    : isCategoryGroup
      ? (items as SalesByCategoryItem[]).map((item) => ({
          ...item,
          id: item.category,
        }))
      : (items as SalesByProductItem[]).map((item) => ({
          ...item,
          id: item.productCode ?? item.productName,
        }));

  const renderRow = (
    item: (SalesByProductItem | SalesByDayItem | SalesByCategoryItem) & {
      id: string;
    },
  ) =>
    isDayGroup ? (
      <>
        <td className="text-left">{item.unitsSold} pcs</td>
        <td>{formatRevenue(item.revenue)}</td>
        <td>{(item as SalesByDayItem).ordersCount}</td>
        <td>{formatRevenue((item as SalesByDayItem).averageCheck)}</td>
        <td className="text-left">{formatDateToShort(new Date(item.id))}</td>
      </>
    ) : isCategoryGroup ? (
      <>
        <td className="text-left">{(item as SalesByCategoryItem).category}</td>
        <td>{item.unitsSold} pcs</td>
        <td>{formatRevenue(item.revenue)}</td>
      </>
    ) : (
      <>
        <td className="text-left">
          {(item as SalesByProductItem).productCode ?? '-'}
        </td>
        <td>{(item as SalesByProductItem).productName}</td>
        <td>{item.unitsSold} pcs</td>
        <td>{formatRevenue(item.revenue)}</td>
      </>
    );

  function getColumns() {
    if (isDayGroup) return dayColumns;
    if (isCategoryGroup) return categoryColumns;
    return productColumns;
  }

  const renderSummary = (
    summary: SalesByProductSummary | SalesByDaySummary | SalesByCategorySummary,
  ) => {
    return (
      <div className="flex-end justify-end gap-2 pr-2 text-right text-sm font-bold text-gray-700">
        <p>Total Revenue: {summary?.totalRevenue}</p>
        <p>Total Units Sold: {summary?.totalUnitsSold}</p>
      </div>
    );
  };

  return (
    <MainTable
      columns={getColumns()}
      items={rows}
      loading={loading}
      error={error}
      emptyMessage="No sales data found"
      renderRow={renderRow}
      summary={summary ? renderSummary(summary) : null}
    />
  );
}
