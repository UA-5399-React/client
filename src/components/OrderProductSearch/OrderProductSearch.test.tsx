import type { ComponentProps } from 'react';
import type { Control } from 'react-hook-form';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ORDER_STATUS, type OrderFormData } from '@/types/tableOrders.types';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { OrderProductSearch } from './OrderProductSearch';

const searchProductInputName = /^Search product(?:\s*\*)?$/i;

const { mockUseAdminProducts } = vi.hoisted(() => ({
  mockUseAdminProducts: vi.fn((params?: Record<string, unknown>) => {
    void params;
    return {
      items: [] as { id: string; title: string; price: number }[],
      loading: false,
      error: undefined,
      totalPages: 1,
      total: 0,
      page: 1,
    };
  }),
}));

vi.mock('@/hooks/useAdminProduct', () => ({
  useAdminProducts: (params: Record<string, unknown> | undefined) =>
    mockUseAdminProducts(params),
}));

vi.mock('@/hooks/useDebouncedValue', () => ({
  useDebouncedValue: <T,>(value: T) => value,
}));

function FormWatchSummary({ control }: { control: Control<OrderFormData> }) {
  const productId = useWatch({ control, name: 'items.0.productId' });
  const productName = useWatch({ control, name: 'items.0.productName' });
  const price = useWatch({ control, name: 'items.0.price' });
  return (
    <>
      <span data-testid="form-product-id">{productId}</span>
      <span data-testid="form-product-name">{productName}</span>
      <span data-testid="form-price">{price}</span>
    </>
  );
}

function TestHarness({
  items,
  ...orderSearchProps
}: {
  items: OrderFormData['items'];
} & Partial<ComponentProps<typeof OrderProductSearch>>) {
  const methods = useForm<OrderFormData>({
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      status: ORDER_STATUS.NEW,
      items,
    },
  });

  return (
    <FormProvider {...methods}>
      <OrderProductSearch
        index={0}
        control={methods.control}
        setValue={methods.setValue}
        getValues={methods.getValues}
        {...orderSearchProps}
      />
      <FormWatchSummary control={methods.control} />
    </FormProvider>
  );
}

describe('Component: OrderProductSearch', () => {
  beforeEach(() => {
    mockUseAdminProducts.mockReset();
    mockUseAdminProducts.mockImplementation(() => ({
      items: [],
      loading: false,
      error: undefined,
      totalPages: 1,
      total: 0,
      page: 1,
    }));
  });

  it('renders label and shows product name from form default values', () => {
    render(
      <TestHarness
        items={[
          {
            productId: 'p-pro',
            productName: 'Widget Pro',
            price: '19.99',
            quantity: '1',
          },
        ]}
      />,
    );

    expect(screen.getByText('Search product')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: searchProductInputName }),
    ).toHaveValue('Widget Pro');
  });

  it('shows empty input when product name is not set', () => {
    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
      />,
    );

    expect(
      screen.getByRole('textbox', { name: searchProductInputName }),
    ).toHaveValue('');
  });

  it('renders error message when error prop is passed', () => {
    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
        error="Pick a product"
      />,
    );

    expect(screen.getByText('Pick a product')).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: searchProductInputName }),
    ).toHaveAttribute('aria-invalid', 'true');
  });

  it('opens suggestions on focus and shows empty state when there are no products', async () => {
    const user = userEvent.setup();

    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
      />,
    );

    await user.click(
      screen.getByRole('textbox', { name: searchProductInputName }),
    );

    expect(
      screen.getByRole('listbox', { name: 'Product search results' }),
    ).toBeInTheDocument();
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('shows loading state in the suggestions list', async () => {
    mockUseAdminProducts.mockImplementation(() => ({
      items: [],
      loading: true,
      error: undefined,
      totalPages: 1,
      total: 0,
      page: 1,
    }));

    const user = userEvent.setup();
    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
      />,
    );

    await user.click(
      screen.getByRole('textbox', { name: searchProductInputName }),
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('selecting a product updates form productName and price and closes the list', async () => {
    mockUseAdminProducts.mockImplementation(() => ({
      items: [{ id: 'p1', title: 'Ceramic Mug', price: 12.5 }],
      loading: false,
      error: undefined,
      totalPages: 1,
      total: 1,
      page: 1,
    }));

    const user = userEvent.setup();
    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
      />,
    );

    await user.click(
      screen.getByRole('textbox', { name: searchProductInputName }),
    );
    await user.click(screen.getByRole('option', { name: /Ceramic Mug/i }));

    expect(screen.getByTestId('form-product-id')).toHaveTextContent('p1');
    expect(screen.getByTestId('form-product-name')).toHaveTextContent(
      'Ceramic Mug',
    );
    expect(screen.getByTestId('form-price')).toHaveTextContent('12.5');
    expect(
      screen.queryByRole('listbox', { name: 'Product search results' }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: searchProductInputName }),
    ).toHaveValue('Ceramic Mug');
  });

  it('clears linked productName and price when input diverges from committed name', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness
        items={[
          {
            productId: 'w1',
            productName: 'Widget',
            price: '10',
            quantity: '1',
          },
        ]}
      />,
    );

    const input = screen.getByRole('textbox', { name: searchProductInputName });
    await user.clear(input);
    await user.type(input, 'x');

    await waitFor(() => {
      expect(screen.getByTestId('form-product-id')).toHaveTextContent('');
      expect(screen.getByTestId('form-product-name')).toHaveTextContent('');
      expect(screen.getByTestId('form-price')).toHaveTextContent('');
    });
  });

  it('passes trimmed search text to useAdminProducts', async () => {
    const user = userEvent.setup();
    render(
      <TestHarness
        items={[{ productId: '', productName: '', price: '', quantity: '1' }]}
      />,
    );

    await user.type(
      screen.getByRole('textbox', { name: searchProductInputName }),
      'coffee',
    );

    await waitFor(() => {
      expect(mockUseAdminProducts).toHaveBeenCalledWith(
        expect.objectContaining({ search: 'coffee' }),
      );
    });
  });

  it('disables the search input when disabled is true', () => {
    render(
      <TestHarness
        items={[
          { productId: 'a1', productName: 'A', price: '1', quantity: '1' },
        ]}
        disabled
      />,
    );

    expect(
      screen.getByRole('textbox', { name: searchProductInputName }),
    ).toBeDisabled();
  });
});
