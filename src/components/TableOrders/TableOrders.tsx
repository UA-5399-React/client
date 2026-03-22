import type { Column } from '@/types';
import type { OrderItem } from '@/types/tableOrders.types';

import { MainTable } from '../MainTable/MainTable';

// Mock data for testing
const items: OrderItem[] = [
  {
    id: 'order-1',
    productName: 'Product 1',
    customerName: 'Customer 1',
    orderId: '1234567890',
    amount: 100,
    status: 'Pending',
    date: '2021-01-01',
    phone: '1234567890',
  },
  {
    id: 'order-2',
    productName: 'Product 2',
    customerName: 'Customer 2',
    orderId: '1234567890',
    amount: 200,
    status: 'Shipped',
    date: '2021-01-01',
    phone: '1234567890',
  },
];

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

const renderProductRow = (item: OrderItem) => {
  return (
    <>
      <td>
        <div className="flex flex-col items-center gap-2">
          {item.productName}
          <span>Image</span>
        </div>
      </td>
      <td>{item.customerName}</td>
      <td>#{item.orderId}</td>
      <td>${item.amount}</td>
      <td>
        <span>{item.status}</span>
      </td>
      <td>{item.date}</td>
      <td>{item.phone}</td>
      <td>
        <span>View</span>
      </td>
    </>
  );
};

export function TableOrders() {
  // TODO: add loading and error states
  const loading = false;
  const error = null;

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
