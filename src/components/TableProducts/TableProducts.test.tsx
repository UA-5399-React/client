import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '@/types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { TableProducts } from './TableProducts';

const mockNavigate = vi.fn();
const mockDuplicate = vi.fn();
const mockDelete = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

const mockProducts: Product[] = [
  {
    id: '1',
    title: 'Product Alpha',
    status: 'active',
    price: 99,
    description: 'First product',
    imageUrl: 'https://example.com/alpha.jpg',
  },
  {
    id: '2',
    title: 'Product Beta',
    status: 'inactive',
    price: 49,
    description: 'Second product',
    imageUrl: 'https://example.com/beta.jpg',
  },
];

describe('UI Component: TableProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table element', () => {
    render(
      <TableProducts
        items={[]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    render(
      <TableProducts
        items={[]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );

    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('should display "Loading..." when loading is true', () => {
    render(
      <TableProducts
        items={[]}
        loading={true}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not render product rows when loading', () => {
    render(
      <TableProducts
        items={mockProducts}
        loading={true}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.queryByText('Product Alpha')).not.toBeInTheDocument();
  });

  it('should display the error message when error prop is provided', () => {
    const error = new Error('Network failure');
    render(
      <TableProducts
        items={[]}
        loading={false}
        error={error}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });

  it('should render an alert role row when error is present', () => {
    const error = new Error('Oops');
    render(
      <TableProducts
        items={[]}
        loading={false}
        error={error}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should not render product rows when error is present', () => {
    const error = new Error('Oops');
    render(
      <TableProducts
        items={mockProducts}
        loading={false}
        error={error}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.queryByText('Product Alpha')).not.toBeInTheDocument();
  });

  it('should display "No products found" when items array is empty', () => {
    render(
      <TableProducts
        items={[]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should not display "No products found" when items are present', () => {
    render(
      <TableProducts
        items={mockProducts}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.queryByText('No products found')).not.toBeInTheDocument();
  });

  it('should render a row for each product', () => {
    render(
      <TableProducts
        items={mockProducts}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByText('Product Alpha')).toBeInTheDocument();
    expect(screen.getByText('Product Beta')).toBeInTheDocument();
  });

  it('should display product title, status, price, and description', () => {
    render(
      <TableProducts
        items={[mockProducts[0]]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.getByText('Product Alpha')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('First product')).toBeInTheDocument();
  });

  it('should navigate to the product edit page when the edit button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <TableProducts
        items={[mockProducts[0]]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );

    const editButton = screen.getByRole('button', {
      name: `Edit ${mockProducts[0].title}`,
    });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(mockProducts[0].id),
    );
  });

  it('should call onDelete when draft product deletion is confirmed', async () => {
    const user = userEvent.setup();
    const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
    const draftProduct = { ...mockProducts[0], status: 'draft' as const };

    render(
      <TableProducts
        items={[draftProduct]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: `Delete ${draftProduct.title}` }),
    );

    expect(confirmSpy).toHaveBeenCalled();
    expect(mockDelete).toHaveBeenCalledWith(draftProduct.id);
    confirmSpy.mockRestore();
  });

  it('should disable delete button for non-draft products', () => {
    render(
      <TableProducts
        items={[mockProducts[0]]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );

    expect(
      screen.getByRole('button', { name: `Delete ${mockProducts[0].title}` }),
    ).toBeDisabled();
  });
});
