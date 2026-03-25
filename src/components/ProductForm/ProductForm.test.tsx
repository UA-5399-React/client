import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';

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
  afterEach(() => {
    vi.restoreAllMocks();
  });

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
      /active/i,
    );

    expect(screen.getByText(/Last Update:/i)).toBeInTheDocument();
  }, 10000);

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
    const user = userEvent.setup({ delay: null });
    const handleSubmit = vi.fn();

    render(<ProductForm onSubmit={handleSubmit} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    expect(
      await screen.findByText('Product name is required'),
    ).toBeInTheDocument();
    expect(await screen.findByText('Price is required')).toBeInTheDocument();

    fireEvent.change(screen.getByRole('textbox', { name: 'Name Product' }), {
      target: { value: 'IPhone 16' },
    });
    fireEvent.change(screen.getByRole('spinbutton', { name: 'Price' }), {
      target: { value: '999.99' },
    });
    fireEvent.change(screen.getByRole('textbox', { name: 'Description' }), {
      target: { value: 'Flagship phone' },
    });

    await user.click(screen.getByRole('combobox', { name: 'Categories' }));
    await user.click(
      await screen.findByRole('option', { name: 'electronics' }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Product name is required'),
      ).not.toBeInTheDocument();
      expect(screen.queryByText('Price is required')).not.toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

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
  }, 10000);

  it('should call onCancel when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    const handleCancel = vi.fn();

    render(<ProductForm onSubmit={vi.fn()} onCancel={handleCancel} />);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(handleCancel).toHaveBeenCalledOnce();
  });

  it('should open file picker, show preview, and revoke preview URL on unmount', async () => {
    const user = userEvent.setup();
    const createObjectURLMock = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:preview');
    const revokeObjectURLMock = vi
      .spyOn(URL, 'revokeObjectURL')
      .mockImplementation(() => undefined);

    const { container, unmount } = render(
      <ProductForm onSubmit={vi.fn()} onCancel={vi.fn()} />,
    );

    const fileInput = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const clickSpy = vi.spyOn(fileInput, 'click');

    await user.click(screen.getByRole('button', { name: 'Choose File' }));
    expect(clickSpy).toHaveBeenCalledOnce();

    const file = new File(['image'], 'phone.png', { type: 'image/png' });
    fireEvent.change(fileInput, { target: { files: [file] } });

    expect(createObjectURLMock).toHaveBeenCalledWith(file);
    expect(screen.getByAltText('Preview')).toHaveAttribute(
      'src',
      'blob:preview',
    );

    fireEvent.change(fileInput, { target: { files: [] } });

    unmount();

    expect(revokeObjectURLMock).toHaveBeenCalledWith('blob:preview');
  }, 10000);

  it('should update product status in edit mode', async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

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
          imagePreview: null,
        }}
        onSubmit={handleSubmit}
        onCancel={vi.fn()}
      />,
    );

    await user.click(screen.getByRole('combobox', { name: 'Status' }));
    await user.click(screen.getByRole('option', { name: 'Inactive' }));
    await user.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(
      () => {
        expect(handleSubmit).toHaveBeenCalledWith({
          name: 'MacBook Pro',
          price: '2499',
          categories: 'laptop, electronics',
          status: 'INACTIVE',
          description: 'Laptop for work',
          imagePreview: null,
          imageFile: undefined,
        });
      },
      { timeout: 10000 },
    );
  }, 15000);
});
