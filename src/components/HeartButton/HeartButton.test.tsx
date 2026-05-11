import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { wishlistService } from '@/services/wishlist.service';
import { useWishlistStore } from '@/store/useWishlistStore';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { HeartButton } from './HeartButton';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');

  return { ...actual, useNavigate: () => mockNavigate };
});

let mockIsAuth = true;
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

const wishlistItemFromMock = {
  productId: mockProduct.id,
  title: mockProduct.title,
  price: mockProduct.price,
  image: mockProduct.image,
};

describe('HeartButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuth = true;
    useWishlistStore.setState({ items: [] });

    vi.mocked(wishlistService.addToWishlist).mockResolvedValue({
      id: 'u1',
      email: 'a@b.c',
      wishlist: [],
    });
    vi.mocked(wishlistService.removeFromWishlist).mockResolvedValue({
      id: 'u1',
      email: 'a@b.c',
      wishlist: [],
    });
  });

  it('renders add state when not favorite', () => {
    render(<HeartButton product={mockProduct} isFavorite={false} />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Add to wishlist',
    );
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass(
      'stroke-gray-400',
    );
  });

  it('renders remove state when favorite', () => {
    render(<HeartButton product={mockProduct} isFavorite />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Remove from wishlist',
    );
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass(
      'stroke-red-600',
    );
  });

  it('optimistically updates store, calls addToWishlist with product id, then shows success', async () => {
    const user = userEvent.setup();
    render(<HeartButton product={mockProduct} isFavorite={false} />);

    await user.click(screen.getByRole('button'));

    expect(useWishlistStore.getState().items).toEqual([wishlistItemFromMock]);
    expect(wishlistService.addToWishlist).toHaveBeenCalledWith(mockProduct.id);

    await waitFor(() => {
      expect(mockShowMessage).toHaveBeenCalledWith(
        'success',
        'Added',
        'Product added to wishlist',
      );
    });
  });

  it('optimistically clears store, calls removeFromWishlist with product id, then shows success', async () => {
    const user = userEvent.setup();
    useWishlistStore.setState({ items: [wishlistItemFromMock] });

    render(<HeartButton product={mockProduct} isFavorite />);

    await user.click(screen.getByRole('button'));

    expect(useWishlistStore.getState().items).toEqual([]);
    expect(wishlistService.removeFromWishlist).toHaveBeenCalledWith(
      mockProduct.id,
    );

    await waitFor(() => {
      expect(mockShowMessage).toHaveBeenCalledWith(
        'success',
        'Removed',
        'Product removed from wishlist',
      );
    });
  });

  it('rolls back favorite and store when add fails for authenticated user', async () => {
    const user = userEvent.setup();
    vi.mocked(wishlistService.addToWishlist).mockRejectedValueOnce(
      new Error('Wishlist unavailable'),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-label',
        'Add to wishlist',
      );
    });
    expect(useWishlistStore.getState().items).toEqual([]);
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(mockShowMessage).toHaveBeenCalledWith(
      'error',
      'Wishlist Error',
      'Wishlist unavailable',
    );
  });

  it('navigates to login when add fails and user is not authenticated', async () => {
    const user = userEvent.setup();
    mockIsAuth = false;
    vi.mocked(wishlistService.addToWishlist).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
    });
  });

  it('restores wishlist item when remove fails', async () => {
    const user = userEvent.setup();
    useWishlistStore.setState({ items: [wishlistItemFromMock] });
    vi.mocked(wishlistService.removeFromWishlist).mockRejectedValueOnce(
      new Error('Network error'),
    );

    render(<HeartButton product={mockProduct} isFavorite />);

    await user.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(useWishlistStore.getState().items).toEqual([wishlistItemFromMock]);
    });
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Remove from wishlist',
    );
    expect(mockShowMessage).toHaveBeenCalledWith(
      'error',
      'Wishlist Error',
      'Network error',
    );
  });

  it('disables the button while the wishlist request is in flight', async () => {
    const user = userEvent.setup();
    vi.mocked(wishlistService.addToWishlist).mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 50)),
    );

    render(<HeartButton product={mockProduct} isFavorite={false} />);

    const button = screen.getByRole('button');
    const clickPromise = user.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    await clickPromise;

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('syncs visible favorite state when isFavorite prop changes', () => {
    const { rerender } = render(
      <HeartButton product={mockProduct} isFavorite={false} />,
    );

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Add to wishlist',
    );

    rerender(<HeartButton product={mockProduct} isFavorite />);

    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      'Remove from wishlist',
    );
    expect(screen.getByRole('button').querySelector('svg')).toHaveClass(
      'stroke-red-600',
    );
  });
});
