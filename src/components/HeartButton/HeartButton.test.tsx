import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { wishlistService } from '@/services/wishlist.service';

import { HeartButton } from './HeartButton';

vi.mock('@/services/wishlist.service', () => ({
  wishlistService: {
    addToWishlist: vi.fn(),
    removeFromWishlist: vi.fn(),
  },
}));

const mockProduct = {
  id: '123',
  title: 'Test Product',
  price: 100,
  image: 'test.jpg',
};

describe('HeartButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct styles when isFavorite is true', () => {
    render(<HeartButton product={mockProduct} isFavorite={true} />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove from wishlist');

    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('stroke-red-500');
  });

  it('calls addToWishlist when clicked and not favorite', async () => {
    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(wishlistService.addToWishlist).toHaveBeenCalledWith({
      productId: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      image: mockProduct.image,
    });

    await waitFor(() => {
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('stroke-red-500');
    });
  });

  it('calls removeFromWishlist when clicked and is favorite', async () => {
    render(<HeartButton product={mockProduct} isFavorite={true} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(wishlistService.removeFromWishlist).toHaveBeenCalledWith(
      mockProduct.id,
    );

    await waitFor(() => {
      const icon = button.querySelector('svg');
      expect(icon).toHaveClass('stroke-gray-400');
    });
  });

  it('reverts state on service failure', async () => {
    vi.mocked(wishlistService.addToWishlist).mockRejectedValueOnce(new Error());

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('stroke-red-500');

    await waitFor(() => {
      expect(icon).toHaveClass('stroke-gray-400');
    });
  });

  it('disables button during loading state', async () => {
    vi.mocked(wishlistService.addToWishlist).mockImplementation(
      () => new Promise((res) => setTimeout(res, 50)),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });
});
