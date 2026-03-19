import { describe, expect, it, vi } from 'vitest';

import type { Product } from '@/types';
import { render, screen } from '@/utils/test-utils';

import { NewArrivals } from './NewArrivals';

vi.mock('@/components', () => ({
  ProductCard: ({ product }: { product: Product }) => (
    <div data-testid={`product-card-${product.id}`}>{product.title}</div>
  ),
}));

const mockProducts: Product[] = [
  {
    _id: '1',
    id: '1',
    title: 'First product',
    price: 10,
    status: 'active',
    createdAt: '2026-03-17T10:00:00.000Z',
  },
  {
    _id: '2',
    id: '2',
    title: 'Second product',
    price: 20,
    status: 'active',
    createdAt: '2026-03-17T11:00:00.000Z',
  },
];

describe('UI Component: NewArrivals', () => {
  it('should render loading state', () => {
    render(<NewArrivals products={[]} isLoading isError={false} />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(<NewArrivals products={[]} isLoading={false} isError />);

    expect(screen.getByText('Failed to load products.')).toBeInTheDocument();
  });

  it('should render empty state when there are no products', () => {
    render(<NewArrivals products={[]} isLoading={false} isError={false} />);

    expect(screen.getByText('No products yet.')).toBeInTheDocument();
  });

  it('should render section title and shop link', () => {
    render(
      <NewArrivals products={mockProducts} isLoading={false} isError={false} />,
    );

    expect(
      screen.getByRole('heading', { name: /new arrivals/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /more products/i }),
    ).toBeInTheDocument();
  });

  it('should render product cards for each product', () => {
    render(
      <NewArrivals products={mockProducts} isLoading={false} isError={false} />,
    );

    expect(screen.getByTestId('product-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('product-card-2')).toBeInTheDocument();
    expect(screen.getByText('First product')).toBeInTheDocument();
    expect(screen.getByText('Second product')).toBeInTheDocument();
  });
});
