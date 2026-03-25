import { ActionMenu, MainTable } from '@/components';
import type { Column } from '@/types';
import type { OrderItem } from '@/types/tableOrders.types';

interface TableOrdersProps {
  items: OrderItem[];
  loading: boolean;
  error: Error | null | undefined;
}

const columns: Column[] = [
  { key: 'product', label: 'Product Name', className: '!min-w-[55%]' },
  { key: 'customer', label: 'Customer name', className: 'min-w-[5%]' },
  { key: 'orderId', label: 'Order ID', className: 'min-w-[6%]' },
  { key: 'amount', label: 'Amount', className: 'min-w-[10%]' },
  { key: 'status', label: 'Status', className: 'min-w-[10%]' },
  { key: 'date', label: 'Date', className: 'min-w-[10%]' },
  { key: 'phone', label: 'Phone', className: 'min-w-[15%]' },
  { key: 'actions', label: 'Actions', className: '' },
];

const handleEdit = () => {};

const renderProductRow = (item: OrderItem) => {
  const firstProduct = item.items[0];
  const customerName = `${item.user.firstName} ${item.user.lastName}`.trim();
  const createdAt = new Date(item.createdAt).toLocaleDateString('uk-UA');

  return (
    <>
      <td>
        <div className="flex flex-row gap-2">
          {firstProduct?.imageUrl ? (
            <img
              src={firstProduct.imageUrl}
              alt={firstProduct.title}
              className="h-10 w-10 rounded object-cover"
            />
          ) : null}
          <div className="flex flex-col gap-1 text-left">
            <span>{firstProduct?.title ?? 'No items'}</span>

            <span> Items: {item.items.length}</span>
          </div>
        </div>
      </td>
      <td>{customerName}</td>
      <td>#{item.orderId}</td>
      <td>${item.totalPrice.toFixed(2)}</td>
      <td>
        <span>{item.status}</span>
      </td>
      <td>{createdAt}</td>
      <td>{item.user.phone}</td>
      <td>
        <ActionMenu editAction={() => handleEdit()} />
      </td>
    </>
  );
};

export function TableOrders({ items, loading, error }: TableOrdersProps) {
  return (
    <MainTable
      columns={columns}
      items={items}
      loading={loading}
      error={error}
      emptyMessage="No orders found"
      renderRow={renderProductRow}
    />
  );
}
