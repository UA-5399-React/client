import type { ReactNode } from 'react';
import { AlertCircle } from 'lucide-react';

import type { Column } from '@/types';

type TableItem = { id: string };

interface MainTableProps<T extends TableItem> {
  columns: Column[];
  items: T[];
  renderRow: (item: T) => ReactNode;
  loading?: boolean;
  error?: Error | null;
  colSpan?: number;
  emptyMessage?: string;
}

interface RenderBodyContentProps<T extends TableItem> {
  loading: boolean;
  error: Error | null;
  items: T[];
  colSpan: number;
  emptyMessage: string;
  renderRow: (item: T) => ReactNode;
}

function renderBodyContent<T extends TableItem>({
  loading,
  error,
  items,
  colSpan,
  emptyMessage,
  renderRow,
}: RenderBodyContentProps<T>) {
  if (loading) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-text py-8 text-center">
          Loading...
        </td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr role="alert">
        <td colSpan={colSpan} className="py-8">
          <div className="border-red600 text-red600 bg-red600/10 mx-auto flex max-w-md items-center gap-3 rounded-lg border p-2">
            <AlertCircle className="h-6 w-6 shrink-0" />

            <div>
              <p className="m-2 font-medium">Something went wrong</p>
              <p className="m-2 text-sm">Please try again later</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }
  if (!items?.length) {
    return (
      <tr>
        <td colSpan={colSpan} className="text-text py-8 text-center">
          {emptyMessage}
        </td>
      </tr>
    );
  }
  return items.map((item) => (
    <tr className="text-text h-[80px] text-center" key={item.id}>
      {renderRow(item)}
    </tr>
  ));
}

export function MainTable<T extends TableItem>({
  columns,
  items,
  renderRow,
  loading,
  error,
  colSpan = columns.length,
  emptyMessage = 'No data found',
}: MainTableProps<T>) {
  return (
    <div className="border-gray100 mx-5 mt-5 rounded-l-lg rounded-r-lg border shadow-md">
      <table className="[&_td]:border-gray100 [&_thead_th]:border-gray100 w-full border-collapse rounded-t-lg [&_td]:border-b [&_thead_th]:border-b">
        <thead className="text-gray600 bg-backgroundSec h-[50px] px-[12px] text-center">
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.className}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={`bg-background [&_td]:px-4`}>
          {renderBodyContent({
            loading: !!loading,
            error: error ?? null,
            items,
            colSpan,
            emptyMessage,
            renderRow,
          })}
        </tbody>
      </table>
    </div>
  );
}
