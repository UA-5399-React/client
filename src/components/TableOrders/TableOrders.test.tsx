import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const deleteOrderMock = vi.fn();

vi.mock('@/hooks/useDeleteAdminOrder', () => ({
  useDeleteAdminOrder: () => ({
    deleteOrder: deleteOrderMock,
    data: undefined,
    loading: false,
    error: undefined,
  }),
}));

import { ORDER_STATUS, type OrderItem } from '@/types/tableOrders.types';
import { formatDate } from '@/utils';
import { render, screen, waitFor } from '@/utils/test-utils';

import { TableOrders } from './TableOrders';

const orderItem: OrderItem = {
  id: 'order-1',
  orderId: 'ORD-20250324-0001',
  items: [
    {
      title: 'Test product',
      imageUrl: 'https://example.com/product.jpg',
      unitPrice: 999.99,
      amount: 2,
    },
  ],
  user: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    phone: '+380501234567',
  },
  amount: 1999.98,
  totalPrice: 1999.98,
  status: ORDER_STATUS.PROCESSING,
  createdAt: '2025-03-24T12:00:00.000Z',
};

const onStatusChange = vi.fn(async () => {});
const onEdit = vi.fn();

describe('UI Component: TableOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table', () => {
    render(
      <TableOrders
        items={[]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    render(
      <TableOrders
        items={[]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: 'Product Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Customer name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Order ID' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Amount' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Date' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Phone' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toBeInTheDocument();
  });

  it('should render empty state when there are no orders', () => {
    render(
      <TableOrders
        items={[]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    expect(screen.getByText('No orders found')).toBeInTheDocument();
  });

  it('should render order row values', () => {
    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    expect(screen.getByText('Test product')).toBeInTheDocument();
    expect(screen.getByText('Items: 1')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('#ORD-20250324-0001')).toBeInTheDocument();
    expect(screen.getByText('$1999.98')).toBeInTheDocument();
    expect(screen.getByText('+380501234567')).toBeInTheDocument();
    expect(
      screen.getByText(formatDate(new Date(orderItem.createdAt))),
    ).toBeInTheDocument();
  });

  it('should show selected order status in dropdown trigger', () => {
    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'Processing',
    );
  });

  it('should open delete confirmation modal', async () => {
    const user = userEvent.setup();

    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    const actionButtons = screen.getAllByRole('button');
    await user.click(actionButtons[actionButtons.length - 1]);

    expect(screen.getByText('Delete')).toBeInTheDocument();

    await user.click(screen.getByText('Delete'));

    expect(
      screen.getByText('Are you sure you want to delete this order?'),
    ).toBeInTheDocument();
  });

  it('should call deleteOrder with orderId after confirm', async () => {
    const user = userEvent.setup();

    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    const actionButtons = screen.getAllByRole('button');
    await user.click(actionButtons[actionButtons.length - 1]);

    await user.click(screen.getByText('Delete'));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteOrderMock).toHaveBeenCalledWith(orderItem.orderId);
  });

  it('should call onStatusChange with orderId and new status when status changes', async () => {
    const user = userEvent.setup();

    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByRole('option', { name: 'Completed' }));

    await waitFor(() => {
      expect(onStatusChange).toHaveBeenCalledTimes(1);
    });
    expect(onStatusChange).toHaveBeenCalledWith(
      orderItem.orderId,
      ORDER_STATUS.COMPLETED,
    );
  });

  it('should not call onStatusChange when selecting the current status', async () => {
    const user = userEvent.setup();

    render(
      <TableOrders
        items={[orderItem]}
        loading={false}
        error={null}
        onStatusChange={onStatusChange}
        onEdit={onEdit}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByRole('option', { name: 'Processing' }));

    expect(onStatusChange).not.toHaveBeenCalled();
  });
});
