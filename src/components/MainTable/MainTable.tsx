import type { ReactNode } from 'react';
import clsx from 'clsx';
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
          <div className="mx-auto flex max-w-md items-center gap-3 rounded-lg border border-red-600 bg-red-600/10 p-2 text-red-600">
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
    <div className="rounded-l-lg rounded-r-lg border border-gray-100 shadow-md">
      <table className="w-full border-separate border-spacing-0 rounded-t-lg rounded-b-lg [&_tbody_tr:last-child_td:first-child]:rounded-bl-lg [&_tbody_tr:last-child_td:last-child]:rounded-br-lg [&_td]:border-b [&_td]:border-gray-100 [&_thead_th]:border-b [&_thead_th]:border-gray-100">
        <thead className="bg-backgroundSec h-[50px] rounded-tl-lg rounded-tr-lg px-[12px] text-center text-gray-600 [&_th]:px-2">
          <tr>
            {columns.map((column, index) => (
              <th
                key={column.key}
                className={clsx(
                  column.className,
                  index === 0 && 'rounded-tl-lg',
                  index === columns.length - 1 && 'rounded-tr-lg',
                )}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className={`bg-background [&_td]:px-2`}>
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
