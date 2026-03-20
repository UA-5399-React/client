import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { ProductForm } from './ProductForm';

vi.mock('@/hooks', () => ({
  useAdminCategories: () => ({
    categories: [
      { id: 'phones', title: 'phones' },
      { id: 'electronics', title: 'electronics' },
      { id: 'laptop', title: 'laptops' },
    ],
  }),
}));

describe('Component: ProductForm', () => {
  it('should render correctly in CREATE mode (no status field, no last update)', () => {
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    expect(
      screen.getByRole('textbox', { name: 'Name Product' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('spinbutton', { name: 'Price' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Categories' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('textbox', { name: 'Description' }),
    ).toBeInTheDocument();

    expect(
      screen.queryByRole('combobox', { name: 'Status' }),
    ).not.toBeInTheDocument();

    expect(screen.queryByText(/Last Update:/i)).not.toBeInTheDocument();
  });

  it('should render initial data, status field, and last update in EDIT mode', () => {
    render(
      <ProductForm
        isEditMode={true}
        updatedAt="2025-10-10T12:00:00Z"
        initialData={{
          name: 'MacBook Pro',
          price: '2499',
          categories: 'laptop, electronics',
          status: 'ACTIVE',
          description: 'Laptop for work',
          imagePreview: 'https://example.com/product.png',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
      />,
    );

    expect(screen.getByDisplayValue('MacBook Pro')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2499')).toBeInTheDocument();
    expect(
      screen.getByRole('combobox', { name: 'Categories' }),
    ).toHaveTextContent('laptop');
    expect(
      screen.getByRole('combobox', { name: 'Categories' }),
    ).toHaveTextContent('electronics');
    expect(screen.getByDisplayValue('Laptop for work')).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'https://example.com/product.png',
    );

    expect(screen.getByRole('combobox', { name: 'Status' })).toHaveTextContent(
      'ACTIVE',
    );

    expect(screen.getByText(/Last Update:/i)).toBeInTheDocument();
  });

  it('should show validation errors for required fields on submit', async () => {
    const user = userEvent.setup();
    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Product name is required'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Price is required')).toBeInTheDocument();
  });

  it('should clear validation errors on input and submit valid form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    render(<ProductForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const nameInput = screen.getByRole('textbox', { name: 'Name Product' });
    const priceInput = screen.getByRole('spinbutton', { name: 'Price' });
    const categorySelect = screen.getByRole('combobox', {
      name: 'Categories',
    });
    const descriptionInput = screen.getByRole('textbox', {
      name: 'Description',
    });

    await user.type(nameInput, 'IPhone 16');
    await user.type(priceInput, '999.99');
    await user.click(categorySelect);
    const option = await screen.findByRole('option', { name: 'electronics' });
    await user.click(option);
    await user.type(descriptionInput, 'Flagship phone');

    await waitFor(() => {
      expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'IPhone 16',
        price: '999.99',
        categories: 'electronics',
        status: 'DRAFT',
        description: 'Flagship phone',
        imagePreview: null,
        imageFile: undefined,
      });
    });
  });

  it('should call onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(<ProductForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalledOnce();
  });
});
