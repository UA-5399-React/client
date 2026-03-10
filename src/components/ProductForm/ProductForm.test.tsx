import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { ProductForm } from './ProductForm';

describe('Component: ProductForm', () => {
  it('should render initial data', () => {
    render(
      <ProductForm
        initialData={{
          name: 'MacBook Pro',
          price: '2499',
          categories: 'laptops, electronics',
          status: 'active',
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
      screen.getByDisplayValue('laptops, electronics'),
    ).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Active');
    expect(screen.getByDisplayValue('Laptop for work')).toBeInTheDocument();
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'https://example.com/product.png',
    );
  });

  it('should show validation errors for required fields', async () => {
    const user = userEvent.setup();

    render(<ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Product name is required'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Price is required')).toBeInTheDocument();
    expect(
      await screen.findByText('Categories are required'),
    ).toBeInTheDocument();
  });

  it('should clear validation errors on input and submit valid form data', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn().mockResolvedValue(undefined);

    render(<ProductForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    await user.click(screen.getByRole('button', { name: 'Save' }));

    const nameInput = screen.getByRole('textbox', { name: 'Name Product' });
    const priceInput = screen.getByRole('spinbutton', { name: 'Price' });
    const categoriesInput = screen.getByRole('textbox', {
      name: 'Categories',
    });
    const descriptionInput = screen.getByRole('textbox', {
      name: 'Description',
    });

    await user.type(nameInput, 'IPhone 16');
    await user.type(priceInput, '999.99');
    await user.type(categoriesInput, 'phones, electronics');
    await user.type(descriptionInput, 'Flagship phone');

    await waitFor(() => {
      expect(
        screen.queryByText('Product name is required'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Price is required')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Categories are required'),
      ).not.toBeInTheDocument();
    });

    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        name: 'IPhone 16',
        price: '999.99',
        categories: 'phones, electronics',
        status: 'draft',
        description: 'Flagship phone',
        imagePreview: null,
        imageFile: undefined,
      });
    });
  });
});
