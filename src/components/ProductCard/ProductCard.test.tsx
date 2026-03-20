import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Product } from '@/types/product.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ProductCard } from './ProductCard';

// ─── Navigation ───────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

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

  // ── Static rendering ─────────────────────────────────────────────────────────
  it('should render product title and price', () => {
    render(<ProductCard product={mockProduct} />);
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render product image with correct alt text and src', () => {
    render(<ProductCard product={mockProduct} />);
    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

  it('should render the placeholder icon when imageUrl is absent', () => {
    render(<ProductCard product={productWithoutImage} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
    // The placeholder container is identifiable by the SVG inside it
    const placeholder = document.querySelector('.bg-gray-100');
    expect(placeholder).toBeInTheDocument();
  });

  // ── Hover interactions ───────────────────────────────────────────────────────
  it('should show Add to Cart button on hover', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    const card = screen.getByAltText('Test Product').closest('div');
    await user.hover(card!);
    expect(screen.getByText('Add to Cart')).toBeVisible();
  });

  it('should show wishlist button on hover', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    const card = screen.getByAltText('Test Product').closest('div');
    await user.hover(card!);
    expect(screen.getByLabelText('Add to wishlist')).toBeVisible();
  });

  it('should hide Add to Cart button wrapper when not hovered', () => {
    render(<ProductCard product={mockProduct} />);
    const button = screen.getByText('Add to Cart');
    expect(button.closest('div')).toHaveClass('opacity-0');
  });

  // ── Navigation ───────────────────────────────────────────────────────────────
  it('should navigate to /product/:_id when card image area is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    // The clickable wrapper div sits around the image
    const clickableArea = screen
      .getByAltText('Test Product')
      .closest('[class*="cursor-pointer"]');
    await user.click(clickableArea!);
    expect(mockNavigate).toHaveBeenCalledWith('/product/mongo1');
  });

  it('should navigate using _id when product has only _id (no id)', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={productWithMongoId} />);
    // Placeholder div is the clickable area when there is no image
    const clickableArea = document.querySelector(
      '.cursor-pointer',
    ) as HTMLElement;
    await user.click(clickableArea);
    expect(mockNavigate).toHaveBeenCalledWith('/product/mongo-only');
  });

  // ── Add to Cart ──────────────────────────────────────────────────────────────
  it('should call addItem with the product when Add to Cart is clicked', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByText('Add to Cart'));
    expect(mockAddItem).toHaveBeenCalledWith(mockProduct);
  });

  it('should not trigger card navigation when Add to Cart is clicked (stopPropagation)', async () => {
    const user = userEvent.setup();
    render(<ProductCard product={mockProduct} />);
    await user.click(screen.getByText('Add to Cart'));
    // addItem called but navigate must NOT have been called for the card click
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
