import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useTheme } from '@/hooks/useTheme';
import { useWishlistStore } from '@/store/useWishlistStore';

import { WishlistCounter } from './WishlistCounter';

vi.mock('@/hooks/useWishlistProducts', () => ({
  useWishlistProducts: vi.fn(),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('WishlistCounter', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useWishlistStore.setState({ items: [] });

    vi.mocked(useTheme).mockReturnValue({
      isDark: false,
    } as never);
  });

  it('does not render when wishlist is empty', () => {
    const { container } = render(<WishlistCounter />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders wishlist item count for light theme', () => {
    useWishlistStore.setState({
      items: [
        {
          productId: 'p1',
          title: 'Product 1',
          price: 100,
        },
        {
          productId: 'p2',
          title: 'Product 2',
          price: 200,
        },
      ],
    });

    render(<WishlistCounter />);

    const counter = screen.getByText('2');

    expect(counter).toBeInTheDocument();
    expect(counter).toHaveClass('bg-black', 'text-white');
  });

  it('renders wishlist item count for dark theme', () => {
    vi.mocked(useTheme).mockReturnValue({
      isDark: true,
    } as never);

    useWishlistStore.setState({
      items: [
        {
          productId: 'p1',
          title: 'Product 1',
          price: 100,
        },
      ],
    });

    render(<WishlistCounter />);

    const counter = screen.getByText('1');

    expect(counter).toBeInTheDocument();
    expect(counter).toHaveClass('bg-white', 'text-black');
  });
});
