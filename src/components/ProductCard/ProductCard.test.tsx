import { describe, expect, it } from 'vitest';

import type { Product } from '@/types/product.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ProductCard } from './ProductCard';

const mockProduct: Product = {
  id: '1',
  title: 'Test Product',
  price: 99.99,
  imageUrl: 'https://example.com/image.jpg',
  description: 'Test description',
  status: 'active',
  tags: [],
};

describe('UI Component: ProductCard', () => {
  it('should render product title and price', () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('should render product image with correct alt text', () => {
    render(<ProductCard product={mockProduct} />);

    const image = screen.getByAltText('Test Product');
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', mockProduct.imageUrl);
  });

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

  it('should hide Add to Cart button when not hovered', () => {
    render(<ProductCard product={mockProduct} />);

    const button = screen.getByText('Add to Cart');
    expect(button.closest('div')).toHaveClass('opacity-0');
  });
});
