import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useCartStore } from '@/store/useCartStore';

import { Cart } from './Cart';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

let mockIsAuth = false;
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: mockIsAuth }),
}));

describe('Cart Page', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    useCartStore.setState({ items: [] });
    mockIsAuth = false;
  });

  it('renders "Your Cart is Empty" when there are no items', () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();
    expect(screen.getByText(/Start Shopping/i)).toBeInTheDocument();
  });

  it('renders cart items and Stepper when there are items', () => {
    useCartStore.setState({
      items: [
        {
          product: {
            id: 'p1',
            title: 'Test Product',
            price: 50,
            status: 'active',
          },
          quantity: 1,
        },
      ],
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Shopping cart')).toBeInTheDocument(); // Stepper
    expect(screen.getByText(/Cart summary/i)).toBeInTheDocument();
  });

  it('redirects guest user to login when clicking Checkout', () => {
    useCartStore.setState({
      items: [
        {
          product: {
            id: 'p1',
            title: 'Test Product',
            price: 50,
            status: 'active',
          },
          quantity: 1,
        },
      ],
    });
    mockIsAuth = false;

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

    expect(mockNavigate).toHaveBeenCalledWith(
      '/login',
      expect.objectContaining({ state: { from: '/cart' } }),
    );
  });

  it('redirects authorized user to /checkout when clicking Checkout', () => {
    useCartStore.setState({
      items: [
        {
          product: {
            id: 'p1',
            title: 'Test Product',
            price: 50,
            status: 'active',
          },
          quantity: 1,
        },
      ],
    });
    mockIsAuth = true;

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });
});
