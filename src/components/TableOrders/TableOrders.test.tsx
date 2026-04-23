import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { useErrorStore } from '@/store/errorStore';

const deleteOrderMock = vi.fn();
const showMessageMock = vi.fn();

vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn(),
}));

const mockedUseErrorStore = vi.mocked(useErrorStore) as unknown as Mock;

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
const onSortChange = vi.fn();

const defaultProps = {
  items: [] as OrderItem[],
  loading: false,
  error: null,
  sort: null,
  order: 'desc' as const,
  onSortChange,
  onStatusChange,
  onEdit,
};

const renderTable = (
  props: Partial<React.ComponentProps<typeof TableOrders>> = {},
) => {
  return render(<TableOrders {...defaultProps} {...props} />);
};

describe('UI Component: TableOrders', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseErrorStore.mockReturnValue(showMessageMock);
  });

  it('should render the table', () => {
    renderTable();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    renderTable();

    expect(
      screen.getByRole('columnheader', { name: 'Product Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /customer name/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /order id/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /total price/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /date/i })).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Phone' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toBeInTheDocument();
  });

  it('should render empty state when there are no orders', () => {
    renderTable();

    expect(screen.getByText('No orders found')).toBeInTheDocument();
  });

  it('should render order row values', () => {
    renderTable({
      items: [orderItem],
    });

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

  it('should call onSortChange when customer name header is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      sort: null,
    });

    await user.click(screen.getByRole('button', { name: /customer name/i }));

    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith('customerName');
  });

  it('should call onSortChange when order id header is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      sort: null,
    });

    await user.click(screen.getByRole('button', { name: /order id/i }));

    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith('orderId');
  });

  it('should call onSortChange when total price header is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      sort: null,
    });

    await user.click(screen.getByRole('button', { name: /total price/i }));

    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith('totalPrice');
  });

  it('should call onSortChange when date header is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      sort: null,
    });

    await user.click(screen.getByRole('button', { name: /date/i }));

    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith('createdAt');
  });

  it('should show selected order status in dropdown trigger', () => {
    renderTable({
      items: [orderItem],
    });

    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'Processing',
    );
  });

  it('should open delete confirmation modal', async () => {
    const user = userEvent.setup();

    renderTable({
      items: [orderItem],
    });

    await user.click(
      screen.getByRole('button', {
        name: `Actions for order ${orderItem.orderId}`,
      }),
    );

    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    expect(
      screen.getByText('Are you sure you want to delete this order?'),
    ).toBeInTheDocument();
  });

  it('should call deleteOrder with orderId after confirm', async () => {
    const user = userEvent.setup();

    renderTable({
      items: [orderItem],
    });

    await user.click(
      screen.getByRole('button', {
        name: `Actions for order ${orderItem.orderId}`,
      }),
    );

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    expect(deleteOrderMock).toHaveBeenCalledWith(orderItem.orderId);
  });

  it('should call onStatusChange with orderId and new status when status changes', async () => {
    const user = userEvent.setup();

    renderTable({
      items: [orderItem],
    });

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

  it('should show success message after successful deletion', async () => {
    const user = userEvent.setup();
    deleteOrderMock.mockResolvedValueOnce(undefined);

    renderTable({ items: [orderItem] });

    await user.click(
      screen.getByRole('button', {
        name: `Actions for order ${orderItem.orderId}`,
      }),
    );

    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(deleteOrderMock).toHaveBeenCalledWith(orderItem.orderId);
      expect(showMessageMock).toHaveBeenCalledWith(
        'success',
        'Order Deleted',
        expect.stringContaining(orderItem.orderId),
      );
    });
  });

  it('should show error message when deletion fails', async () => {
    const user = userEvent.setup();
    const errorMessage = 'API Connection Error';
    deleteOrderMock.mockRejectedValueOnce(new Error(errorMessage));

    renderTable({ items: [orderItem] });

    await user.click(
      screen.getByRole('button', {
        name: `Actions for order ${orderItem.orderId}`,
      }),
    );
    await user.click(screen.getByRole('button', { name: /^delete$/i }));
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await waitFor(() => {
      expect(showMessageMock).toHaveBeenCalledWith(
        'error',
        'Delete Failed',
        errorMessage,
      );
    });
  });
});
