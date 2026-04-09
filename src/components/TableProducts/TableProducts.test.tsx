import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '@/types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { TableProducts } from './TableProducts';

const mockNavigate = vi.fn();
const mockDuplicate = vi.fn();
const mockDelete = vi.fn();
const mockSortChange = vi.fn();

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
    createdAt: '2026-04-07T10:00:00.000Z',
    purchaseCount: 7,
  },
  {
    id: '2',
    title: 'Product Beta',
    status: 'inactive',
    price: 49,
    description: 'Second product',
    imageUrl: 'https://example.com/beta.jpg',
    createdAt: '2026-04-08T10:00:00.000Z',
    purchaseCount: 3,
  },
];

const defaultProps = {
  items: [] as Product[],
  loading: false,
  error: undefined,
  sort: 'title' as const,
  order: 'asc' as const,
  onSortChange: mockSortChange,
  onDelete: mockDelete,
  onDuplicate: mockDuplicate,
};

const renderTable = (
  props: Partial<React.ComponentProps<typeof TableProducts>> = {},
) => {
  return render(<TableProducts {...defaultProps} {...props} />);
};

describe('UI Component: TableProducts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table element', () => {
    renderTable();

    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    renderTable();

    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /price/i })).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /created date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /units purchased/i }),
    ).toBeInTheDocument();
  });

  it('should display "Loading..." when loading is true', () => {
    renderTable({
      loading: true,
    });

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should not render product rows when loading', () => {
    renderTable({
      items: mockProducts,
      loading: true,
    });

    expect(screen.queryByText('Product Alpha')).not.toBeInTheDocument();
  });

  it('should display the error message when error prop is provided', () => {
    const error = new Error('Network failure');

    renderTable({
      error,
    });

    expect(screen.getByText('Failed to load products')).toBeInTheDocument();
    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });

  it('should render an alert role row when error is present', () => {
    const error = new Error('Oops');

    renderTable({
      error,
    });

    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('should not render product rows when error is present', () => {
    const error = new Error('Oops');

    renderTable({
      items: mockProducts,
      error,
    });

    expect(screen.queryByText('Product Alpha')).not.toBeInTheDocument();
  });

  it('should display "No products found" when items array is empty', () => {
    renderTable();

    expect(screen.getByText('No products found')).toBeInTheDocument();
  });

  it('should not display "No products found" when items are present', () => {
    renderTable({
      items: mockProducts,
    });

    expect(screen.queryByText('No products found')).not.toBeInTheDocument();
  });

  it('should render a row for each product', () => {
    renderTable({
      items: mockProducts,
    });

    expect(screen.getByText('Product Alpha')).toBeInTheDocument();
    expect(screen.getByText('Product Beta')).toBeInTheDocument();
  });

  it('should display product title, status, price, description, and purchase count', () => {
    renderTable({
      items: [mockProducts[0]],
    });

    expect(screen.getByText('Product Alpha')).toBeInTheDocument();
    expect(screen.getByText('active')).toBeInTheDocument();
    expect(screen.getByText('99')).toBeInTheDocument();
    expect(screen.getByText('First product')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });

  it('should call onSortChange when sortable header is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      items: mockProducts,
    });

    await user.click(screen.getByRole('button', { name: /price/i }));

    expect(mockSortChange).toHaveBeenCalledTimes(1);
    expect(mockSortChange).toHaveBeenCalledWith('price');
  });

  it('should navigate to the product edit page when the edit action is clicked', async () => {
    const user = userEvent.setup();

    renderTable({
      items: [mockProducts[0]],
    });

    const triggerButton = screen.getByRole('button', {
      name: `Open actions for ${mockProducts[0].title}`,
    });

    await user.click(triggerButton);
    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(mockProducts[0].id),
    );
  });

  it('should render product thumbnail image when imageUrl is provided', () => {
    render(
      <TableProducts
        items={[mockProducts[0]]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    const img = screen.getByRole('img', { name: mockProducts[0].title });
    expect(img).toHaveAttribute('src', mockProducts[0].imageUrl);
  });

  it('should render a placeholder div when imageUrl is not provided', () => {
    const productWithoutImage: Product = {
      ...mockProducts[0],
      imageUrl: undefined,
    };
    render(
      <TableProducts
        items={[productWithoutImage]}
        loading={false}
        onDelete={mockDelete}
        onDuplicate={mockDuplicate}
      />,
    );
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('should disable delete action for non-draft products', async () => {
    const user = userEvent.setup();

    renderTable({
      items: [mockProducts[0]],
    });

    await user.click(
      screen.getByRole('button', {
        name: `Open actions for ${mockProducts[0].title}`,
      }),
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeDisabled();
  });
});
