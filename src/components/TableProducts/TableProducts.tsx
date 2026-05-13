import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AlertCircle, Copy, Pencil, Trash } from 'lucide-react';

import { ActionMenu, Checkbox, TableSortControl } from '@/components';
import { ROUTES } from '@/constants';
import { STATUS_LABELS } from '@/constants/general';
import { useTheme } from '@/hooks/useTheme';
import { type Product, PRODUCT_STATUS } from '@/types';
import type { ProductSortField, SortOrder } from '@/types/productsSort';
import { formatDate } from '@/utils';

interface TableProductsProps {
  items: Product[] | [];
  loading: boolean;
  error?: Error | null;
  sort: ProductSortField;
  order: SortOrder;
  selectedIds: string[];
  onSortChange: (field: ProductSortField) => void;
  onDelete: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleSelect: (id: string) => void;
  onSelectAll: (ids: string[]) => void;
}

function renderBodyContent(
  loading: boolean,
  error: Error | null,
  items: Product[] | [],
  isDark: boolean,
  navigate: ReturnType<typeof useNavigate>,
  onDelete: (id: string) => void,
  onDuplicate: (id: string) => void,
  selectedIds: string[],
  onToggleSelect: (id: string) => void,
) {
  if (loading) {
    return (
      <tr>
        <td colSpan={9}>Loading...</td>
      </tr>
    );
  }

  if (error) {
    return (
      <tr role="alert">
        <td colSpan={9} className="py-8">
          <div
            className={clsx(
              'mx-auto flex max-w-md items-center gap-3 rounded-lg border p-4',
              {
                'border-red-900/50 bg-red-950/30 text-red-300': isDark,
                'border-red-200 bg-red-50 text-red-800': !isDark,
              },
            )}
          >
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Failed to load products</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }

  if (!items?.length) {
    return (
      <tr>
        <td colSpan={9} className={clsx('text-text py-8 text-center')}>
          No products found
        </td>
      </tr>
    );
  }

  return items.map((item: Product) => {
    const isDraft = item.status.toUpperCase() === PRODUCT_STATUS.DRAFT;

    return (
      <tr
        className="h-[80px] text-center text-[rgb(var(--color-text))]"
        key={item.id}
      >
        <td className="w-12">
          <div className="flex justify-center">
            <Checkbox
              className="h-[20px] w-[20px]"
              checked={selectedIds.includes(item.id)}
              onCheckedChange={() => onToggleSelect(item.id)}
            />
          </div>
        </td>

        <td>
          <div className="flex justify-center">
            {item.imageUrl ? (
              <img
                src={item.imageUrl}
                alt={item.title}
                className="h-10 w-10 rounded object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-100" />
            )}
          </div>
        </td>

        <td>
          <div className="flex flex-col">
            <span>{item.title}</span>
            <span>SKU: {item.productCode ?? '—'}</span>
          </div>
        </td>
        <td className={`${STATUS_LABELS[item.status]} capitalize`}>
          {item.status.toLowerCase()}
        </td>
        <td>{item.price}</td>
        <td>{item.description ?? '—'}</td>
        <td>{item.createdAt ? formatDate(new Date(item.createdAt)) : '—'}</td>
        <td>{item.purchaseCount ?? 0}</td>

        <td>
          <div className="flex justify-end pr-2">
            <ActionMenu
              triggerAriaLabel={`Open actions for ${item.title}`}
              actions={[
                {
                  id: 'edit',
                  label: 'Edit',
                  icon: <Pencil className="h-[20px] w-[20px]" />,
                  onClick: () =>
                    navigate(`${ROUTES.ADMIN_PRODUCTS}/${item.id}`),
                },
                {
                  id: 'duplicate',
                  label: 'Duplicate',
                  icon: <Copy className="h-[20px] w-[20px]" />,
                  onClick: () => onDuplicate(item.id),
                },
                {
                  id: 'delete',
                  label: 'Delete',
                  icon: <Trash className="h-[20px] w-[20px]" />,
                  onClick: () => onDelete(item.id),
                  variant: 'danger',
                  disabled: !isDraft,
                  title: isDraft
                    ? 'Delete product'
                    : 'Only draft products can be deleted',
                },
              ]}
            />
          </div>
        </td>
      </tr>
    );
  });
}

export function TableProducts({
  items,
  loading,
  error,
  sort,
  order,
  selectedIds,
  onSortChange,
  onDelete,
  onDuplicate,
  onToggleSelect,
  onSelectAll,
}: TableProductsProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const pageIds = items.map((i) => i.id);
  const allSelected =
    pageIds.length > 0 && pageIds.every((id) => selectedIds.includes(id));
  const someSelected = pageIds.some((id) => selectedIds.includes(id));
  const handleSelectAll = (checked: boolean) => {
    onSelectAll(checked === true ? pageIds : []);
  };

  return (
    <div className="mx-5 mt-5 overflow-x-auto rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
      <table className="w-full border-collapse overflow-hidden rounded-t-lg [&_td]:border-b [&_td]:border-[#e5e7eb] [&_thead_th]:border-b [&_thead_th]:border-[#e5e7eb] [&_thead_th]:px-4">
        <thead className="h-[50px] bg-[#F9FAFB] px-[12px] text-[#8A92A6]">
          <tr>
            <th className="w-12">
              <div className="flex justify-center">
                <Checkbox
                  className="h-[20px] w-[20px]"
                  checked={allSelected}
                  indeterminate={!allSelected && someSelected}
                  onCheckedChange={handleSelectAll}
                />
              </div>
            </th>

            <th>Image</th>

            <th>
              <TableSortControl
                label="Name"
                field="title"
                currentSort={sort}
                currentOrder={order}
                onSortChange={onSortChange}
              />
            </th>

            <th>Status</th>

            <th>
              <TableSortControl
                label="Price"
                field="price"
                currentSort={sort}
                currentOrder={order}
                onSortChange={onSortChange}
              />
            </th>

            <th>Description</th>

            <th>
              <TableSortControl
                label="Created Date"
                field="createdAt"
                currentSort={sort}
                currentOrder={order}
                onSortChange={onSortChange}
              />
            </th>

            <th>
              <TableSortControl
                label="Units Purchased"
                field="purchaseCount"
                currentSort={sort}
                currentOrder={order}
                onSortChange={onSortChange}
              />
            </th>

            <th></th>
          </tr>
        </thead>

        <tbody className="bg-[rgb(var(--color-bg-sec))] [&_td]:px-4 [&_td]:text-center">
          {renderBodyContent(
            loading,
            error ?? null,
            items,
            isDark,
            navigate,
            onDelete,
            onDuplicate,
            selectedIds,
            onToggleSelect,
          )}
        </tbody>
      </table>
    </div>
  );
}
