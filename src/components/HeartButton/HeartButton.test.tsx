import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { wishlistService } from '@/services/wishlist.service';

import { HeartButton } from './HeartButton';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return { ...actual, useNavigate: () => mockNavigate };
});

let mockIsAuth = false;
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: mockIsAuth }),
}));

const mockShowMessage = vi.fn();
vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn(
    (selector: (s: { show: typeof mockShowMessage }) => unknown) =>
      selector({ show: mockShowMessage }),
  ),
}));

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
    mockIsAuth = true;
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

    expect(mockShowMessage).toHaveBeenCalledWith(
      'success',
      'Added',
      'Product added to wishlist',
    );
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

    expect(mockShowMessage).toHaveBeenCalledWith(
      'success',
      'Removed',
      'Product removed from wishlist',
    );
  });

  it('reverts state on service failure', async () => {
    vi.mocked(wishlistService.addToWishlist).mockRejectedValueOnce(
      new Error('Wishlist unavailable'),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    const icon = button.querySelector('svg');
    expect(icon).toHaveClass('stroke-red-500');

    await waitFor(() => {
      expect(icon).toHaveClass('stroke-gray-400');
    });

    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith(
      'error',
      'Wishlist Error',
      'Wishlist unavailable',
    );
  });

  it('navigates to login on failure when guest', async () => {
    mockIsAuth = false;
    vi.mocked(wishlistService.addToWishlist).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
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

  it('syncs local favorite state when isFavorite prop changes', () => {
    const { rerender } = render(
      <HeartButton product={mockProduct} isFavorite={false} />,
    );

    let button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Add to wishlist');

    rerender(<HeartButton product={mockProduct} isFavorite />);

    button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Remove from wishlist');
    expect(button.querySelector('svg')).toHaveClass('stroke-red-500');
  });
});
