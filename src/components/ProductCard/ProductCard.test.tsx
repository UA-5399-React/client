import { waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '@/types/product.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ProductCard } from './ProductCard';

// ─── Cart store ────────────────────────────────────────────────────────────────
const mockAddItem = vi.fn();
vi.mock('@/store/useCartStore', () => ({
  useCartStore: (selector: (s: { addItem: typeof mockAddItem }) => unknown) =>
    selector({ addItem: mockAddItem }),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────
const mockProduct: Product = {
  id: '1',
  _id: 'mongo1',
  title: 'Test Product',
  price: 99.99,
  imageUrl: 'https://example.com/image.jpg',
  description: 'Test description',
  status: 'active',
  tags: [],
};

const productWithoutImage: Product = {
  id: '2',
  title: 'No Image Product',
  price: 49.99,
  status: 'active',
};

const productWithMongoId: Product = {
  id: '',
  _id: 'mongo-only',
  title: 'Mongo Product',
  price: 29.99,
  status: 'active',
};

describe('UI Component: ProductCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should mark product as favorite if it exists in wishlist', async () => {
    render(<ProductCard product={mockProduct} isFavorite={true} />);

    const btn = await screen.findByLabelText(/remove/i);
    expect(btn).toBeInTheDocument();
  });

  it('should mark product as not favorite if not in wishlist', async () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);

    const btn = await screen.findByLabelText(/add to wishlist/i);
    expect(btn).toBeInTheDocument();
  });

  it('should show placeholder when image fails to load', async () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);

    const img = screen.getByAltText('Test Product');
    img.dispatchEvent(new Event('error'));

    await waitFor(() => {
      const placeholder = document.querySelector('.bg-gray-100');
      expect(placeholder).toBeInTheDocument();
    });
  });

  // ── Static rendering ─────────────────────────────────────────────────────────
  it('should render product title and price', () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render product image with correct alt text and src', () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('should render the placeholder icon when imageUrl is absent', () => {
    render(<ProductCard product={productWithoutImage} isFavorite={false} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    const placeholder = document.querySelector('.bg-gray-100');
    expect(placeholder).toBeInTheDocument();
  });

  // ── Link / navigation ─────────────────────────────────────────────────────────
  it('should render as an anchor element with the correct href', () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    const link = screen.getByRole('link', { name: 'Test Product' });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/product/mongo1');
  });

  it('should render href with _id when product has only _id', () => {
    render(<ProductCard product={productWithMongoId} isFavorite={false} />);
    const link = screen.getByRole('link', { name: 'Mongo Product' });
    expect(link).toHaveAttribute('href', '/product/mongo-only');
  });

  // ── Hover interactions ───────────────────────────────────────────────────────
  it('should show Add to Cart button on hover', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    const link = screen.getByRole('link', { name: 'Test Product' });
    await user.hover(link);
    expect(screen.getByText('Add to Cart')).toBeVisible();
  });

  it('should render wishlist button with correct accessibility label', async () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    const btn = await screen.findByLabelText(/wishlist/i);
    expect(btn).toBeInTheDocument();
  });

  it('should hide Add to Cart button wrapper when not hovered', () => {
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    const button = screen.getByText('Add to Cart');
    expect(button.closest('div')).toHaveClass('opacity-0');
  });

  // ── Add to Cart ──────────────────────────────────────────────────────────────
  it('should call addItem with the product when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    await user.click(screen.getByText('Add to Cart'));
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  it('should prevent default link navigation when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} isFavorite={false} />);
    await user.click(screen.getByText('Add to Cart'));
    // addItem called; the link href should NOT have been followed (no navigation event)
    expect(mockAddItem).toHaveBeenCalledTimes(1);
  });
});
