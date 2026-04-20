import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { CityOption, WarehouseOption } from '@/types/shipping.types';

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
  getCities: vi.fn<(search?: string) => Promise<CityOption[]>>(async () => []),
  getWarehouses: vi.fn<
    (city: string, search?: string) => Promise<WarehouseOption[]>
  >(async () => []),
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

const carrierNameMatcher = /^Carrier(?:\s*\*)?$/i;
const searchProductNameMatcher = /^Search product(?:\s*\*)?$/i;
const statusNameMatcher = /^Status(?:\s*\*)?$/i;
const cityNameMatcher = /^City(?:\s*\*)?$/i;
const branchNumberNameMatcher = /^Branch Number(?:\s*\*)?$/i;
const customerNameMatcher = /^Customer Name(?:\s*\*)?$/i;
const emailNameMatcher = /^Email(?:\s*\*)?$/i;
const phoneNameMatcher = /^Phone(?:\s*\*)?$/i;

async function renderAdminOrderForm(
  ui: ReactElement,
  options?: { skipShippingFlush?: boolean },
) {
  const view = render(ui);
  if (!options?.skipShippingFlush) {
    await waitFor(() => expect(getCities).toHaveBeenCalled());
  }
  return view;
}

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

  beforeEach(() => {
    getCities.mockReset();
    getWarehouses.mockReset();
    getCities.mockResolvedValue([]);
    getWarehouses.mockResolvedValue([]);
  });

  it('renders required fields and default controls', async () => {
    await renderAdminOrderForm(
      <AdminOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    expect(
      screen.getByRole('textbox', { name: customerNameMatcher }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: emailNameMatcher }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: phoneNameMatcher }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: carrierNameMatcher }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: statusNameMatcher }),
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

    await renderAdminOrderForm(
      <AdminOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

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

    await renderAdminOrderForm(
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

    const submittedData = onSubmit.mock.calls[0]![0];
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

    await renderAdminOrderForm(
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

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: statusNameMatcher }));
    await user.click(screen.getByText('Processing'));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    const submittedData = onSubmit.mock.calls[0]![0];
    expect(submittedData.status).toBe(ORDER_STATUS.PROCESSING);
  });

  it('disables actions and shows saving label when loading', async () => {
    await renderAdminOrderForm(
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

  it('renders last update only in edit mode with updatedAt', async () => {
    const { rerender } = await renderAdminOrderForm(
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

  it('shows line items total from price and quantity', async () => {
    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByText('Total: $20.00')).toBeInTheDocument();
  });

  it('shows email validation error for invalid address', async () => {
    const user = userEvent.setup();

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const email = screen.getByRole('textbox', { name: emailNameMatcher });
    await user.clear(email);
    await user.type(email, 'not-email');
    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Enter a valid email')).toBeInTheDocument();
  });

  it('shows branch validation when city set but branch empty', async () => {
    const user = userEvent.setup();

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={{ ...baseInitialData, branchNumber: '' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(await screen.findByText('Branch is required')).toBeInTheDocument();
  });

  it('submits when carrier is Ukrposhta with text city and branch fields', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const ukrData = {
      ...baseInitialData,
      carrier: SHIPPING_CARRIERS.UKRPOSHTA,
    };

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={ukrData}
        onSubmit={onSubmit}
        onCancel={vi.fn()}
      />,
      { skipShippingFlush: true },
    );

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledTimes(1);
    });

    expect(onSubmit.mock.calls[0]![0].carrier).toBe(
      SHIPPING_CARRIERS.UKRPOSHTA,
    );
  });

  it('switches to non-nova carrier and clears searchable shipping mode', async () => {
    const user = userEvent.setup();

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole('combobox', { name: carrierNameMatcher }),
    );
    await user.click(screen.getByText('Meest'));

    expect(
      screen.getByRole('textbox', { name: cityNameMatcher }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: branchNumberNameMatcher }),
    ).toBeInTheDocument();
  });

  it('searches cities and loads warehouses after selecting city', async () => {
    const user = userEvent.setup();

    getCities.mockResolvedValue([
      { ref: 'city-1', name: 'Kyiv', area: 'Kyivska' },
      { ref: 'city-2', name: 'Lviv', area: 'Lvivska' },
    ] as CityOption[]);
    getWarehouses.mockResolvedValue([
      {
        ref: 'wh-25',
        number: '25',
        label: 'Branch 25',
        fullAddress: 'Kyiv, Branch 25',
        isPostMachine: false,
      },
      {
        ref: 'wh-141',
        number: '141',
        label: 'Branch 141',
        fullAddress: 'Kyiv, Branch 141',
        isPostMachine: false,
      },
    ] as WarehouseOption[]);

    await renderAdminOrderForm(
      <AdminOrderForm onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    const cityTrigger = screen.getByRole('button', { name: 'Choose city' });
    await user.click(cityTrigger);
    await user.type(screen.getByPlaceholderText('Searching...'), 'Ky');
    await waitFor(() => {
      expect(getCities).toHaveBeenCalledWith('Ky');
    });

    await user.click(screen.getByText('Kyiv (Kyivska)'));
    await waitFor(() => {
      expect(getWarehouses).toHaveBeenCalledWith('Kyiv', undefined);
    });
  });

  it('searches warehouses with selected city context', async () => {
    const user = userEvent.setup();

    getCities.mockResolvedValue([
      { ref: 'city-1', name: 'Kyiv', area: 'Kyivska' },
    ] as CityOption[]);

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={{ ...baseInitialData, city: 'Kyiv' }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    const branchTrigger = screen.getByRole('button', { name: '141' });
    await user.click(branchTrigger);
    await user.type(screen.getByPlaceholderText('Searching...'), '14');

    await waitFor(() => {
      expect(getWarehouses).toHaveBeenCalledWith('Kyiv', '14');
    });
  });

  it('adds and removes product row', async () => {
    const user = userEvent.setup();

    await renderAdminOrderForm(
      <AdminOrderForm
        initialData={baseInitialData}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(
      screen.getAllByRole('textbox', { name: searchProductNameMatcher }),
    ).toHaveLength(1);

    await user.click(screen.getByRole('button', { name: 'Add product' }));
    expect(
      screen.getAllByRole('textbox', { name: searchProductNameMatcher }),
    ).toHaveLength(2);

    const removeButtons = screen.getAllByRole('button', {
      name: 'Remove product row',
    });
    expect(removeButtons.length).toBeGreaterThanOrEqual(1);

    await user.click(removeButtons[0]!);
    expect(
      screen.getAllByRole('textbox', { name: searchProductNameMatcher }),
    ).toHaveLength(1);
  });
});
