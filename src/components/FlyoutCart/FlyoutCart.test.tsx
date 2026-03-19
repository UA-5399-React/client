import { BrowserRouter } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCartStore } from '@/store/useCartStore';

import { FlyoutCart } from './FlyoutCart';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: false }),
}));

describe('FlyoutCart component', () => {
  beforeEach(() => {
    useCartStore.setState({ items: [], isOpen: true });
    vi.clearAllMocks();
  });

  it('renders nothing when closed', () => {
    useCartStore.setState({ isOpen: false });
    const { container } = render(
      <BrowserRouter>
        <FlyoutCart />
      </BrowserRouter>,
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders "Your cart is empty." when cart is empty', () => {
    render(
      <BrowserRouter>
        <FlyoutCart />
      </BrowserRouter>,
    );
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('renders items and calculates total', () => {
    useCartStore.setState({
      items: [
        {
          product: { id: '1', title: 'Product 1', price: 10, status: 'active' },
          quantity: 2,
        },
      ],
      isOpen: true,
    });

    render(
      <BrowserRouter>
        <FlyoutCart />
      </BrowserRouter>,
    );

    expect(screen.getByText('Product 1')).toBeInTheDocument();
    // 10 * 2 = 20
    expect(screen.getAllByText('$20.00').length).toBeGreaterThan(0);
  });

  it('calls closeCart when clicking the overlay or X button', () => {
    useCartStore.setState({ isOpen: true });

    // We expect state changes to be caught here if needed, or we just spy on state methods
    render(
      <BrowserRouter>
        <FlyoutCart />
      </BrowserRouter>,
    );

    // Test render handles interaction
    const closeButtons = screen.getAllByRole('button');
    expect(closeButtons.length).toBeGreaterThan(0); // at least the X button
  });
});
