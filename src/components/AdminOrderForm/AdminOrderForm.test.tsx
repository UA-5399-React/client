import { describe, expect, it, vi } from 'vitest';

vi.mock('@/hooks/useAdminProduct', () => ({
  useAdminProducts: vi.fn(() => ({
    items: [],
    loading: false,
    error: undefined,
    totalPages: 1,
    total: 0,
    page: 1,
  })),
}));

const { getCities, getWarehouses } = vi.hoisted(() => ({
  getCities: vi.fn(async () => []),
  getWarehouses: vi.fn(async () => []),
}));

vi.mock('@/services', () => ({
  shippingService: {
    getCities,
    getWarehouses,
  },
}));

import { SHIPPING_CARRIERS } from '@/types';
import { ORDER_STATUS } from '@/types/tableOrders.types';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { AdminOrderForm } from './AdminOrderForm';

describe('Component: AdminOrderForm', () => {
  const baseInitialData = {
    customerName: 'John Doe',
    email: 'john@example.com',
    phone: '+380991112233',
    carrier: SHIPPING_CARRIERS.NOVA_POST,
    city: 'Kyiv',
    branchNumber: '141',
    status: ORDER_STATUS.NEW,
    items: [
      {
        productId: 'prod-widget',
        productName: 'Widget',
        price: '10',
        quantity: '2',
      },
    ],
  };

  it('renders required fields and default controls', () => {
    render(<AdminOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(
      screen.getByRole('textbox', { name: 'Customer Name' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Carrier' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Status' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Add product' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument();
    expect(screen.getByText('Total: $0.00')).toBeInTheDocument();
  });

  it('shows validation errors for empty form submit', async () => {
    const user = userEvent.setup();

    render(<AdminOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Customer name is required'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Email is required')).toBeInTheDocument();
    expect(await screen.findByText('Phone is required')).toBeInTheDocument();
    expect(await screen.findByText('City is required')).toBeInTheDocument();
    expect(await screen.findByText('Product is required')).toBeInTheDocument();
  });

  it('submits valid data', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData).toEqual({
      customerName: 'John Doe',
      email: 'john@example.com',
      phone: '+380991112233',
      carrier: SHIPPING_CARRIERS.NOVA_POST,
      city: 'Kyiv',
      branchNumber: '141',
      status: ORDER_STATUS.NEW,
      // Disabled price input is excluded from submit payload by react-hook-form.
      items: [
        { productId: 'prod-widget', productName: 'Widget', quantity: '2' },
      ],
    });
  });

  it('calls onCancel when cancel button clicked', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    render(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={onCancel}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('changes status via dropdown and submits updated value', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByText('Processing'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = onSubmit.mock.calls[0][0];
    expect(submittedData.status).toBe(ORDER_STATUS.PROCESSING);
  });

  it('disables actions and shows saving label when loading', () => {
    render(
      <AdminOrderForm
        isLoading={true}
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: 'Saving...' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Add product' })).toBeDisabled();
  });

  it('renders last update only in edit mode with updatedAt', () => {
    const { rerender } = render(
      <AdminOrderForm
        initialData={baseInitialData}
        updatedAt="2025-10-10T12:00:00Z"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.queryByText(/Last Update:/i)).not.toBeInTheDocument();

    rerender(
      <AdminOrderForm
        initialData={baseInitialData}
        isEditMode={true}
        updatedAt="2025-10-10T12:00:00Z"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText(/Last Update:/i)).toBeInTheDocument();
  });

  it('adds and removes product row', async () => {
    const user = userEvent.setup();

    render(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole('textbox', { name: 'Search product' }),
    ).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Add product' }));
    expect(
      screen.getAllByRole('textbox', { name: 'Search product' }),
    ).toHaveLength(2);

    const removeButtons = screen.getAllByRole('button', {
      name: 'Remove product row',
    });
    expect(removeButtons.length).toBeGreaterThanOrEqual(1);

    await user.click(removeButtons[0]!);
    expect(
      screen.getAllByRole('textbox', { name: 'Search product' }),
    ).toHaveLength(1);
  });
});
