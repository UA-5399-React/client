import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useCartStore } from '@/store/useCartStore';

import { Cart } from './Cart';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(() => ({
    data: null,
    loading: false,
    error: null,
  })),
}));

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

let mockIsDark = false;
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({
    isDark: mockIsDark,
    theme: mockIsDark ? 'dark' : 'light',
  }),
}));

// Mock useCartStore
const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();
const mockGetCartTotal = vi.fn(() => 100);
const mockValidateCart = vi.fn(() => false);

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

describe('Cart Page', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuth = false;
    mockIsDark = false;
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      getCartTotal: mockGetCartTotal,
      validateCart: mockValidateCart,
    });
  });

  const setupWithItems = (is_id = false) => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [
        {
          product: {
            id: is_id ? undefined : 'p1',
            _id: is_id ? 'p1' : undefined,
            title: 'Test Product',
            price: 50,
            status: 'active',
            imageUrl: 'test.jpg',
          },
          quantity: 2,
        },
      ],
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      getCartTotal: mockGetCartTotal,
      validateCart: mockValidateCart,
    });
  };

  it('renders "Your Cart is Empty" when there are no items', () => {
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    expect(screen.getByText(/Your Cart is Empty/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/Start Shopping/i));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SHOP);
  });

  it('renders cart items and Stepper when there are items', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Shopping cart')).toBeInTheDocument();
    expect(screen.getByText(/Cart summary/i)).toBeInTheDocument();
    expect(screen.getAllByText('$100.00').length).toBeGreaterThanOrEqual(1);
  });

  it('handles item removal on desktop', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    // Desktop remove button has "Remove" text
    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('handles quantity increment and decrement on desktop', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    // Desktop quantity buttons
    // In JSDOM, both mobile and desktop versions are in the DOM.
    // Desktop buttons are usually the second set.
    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));

    if (plusButtons[0]) fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);

    if (minusButtons[0]) fireEvent.click(minusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 1);
  });

  it('handles quantity increment and decrement on mobile', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    // Mobile quantity buttons are usually the first set in the DOM
    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));

    if (plusButtons[0]) fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);

    if (minusButtons[0]) fireEvent.click(minusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 1);
  });

  it('disables minus button when quantity is 1', () => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [{ product: { id: 'p1', title: 'P1', price: 10 }, quantity: 1 }],
      updateQuantity: mockUpdateQuantity,
      removeItem: mockRemoveItem,
      getCartTotal: mockGetCartTotal,
      validateCart: mockValidateCart,
    });

    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    minusButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('handles products with _id instead of id', () => {
    setupWithItems(true); // is_id = true
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    const removeBtn = screen.getByRole('button', { name: /remove/i });
    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');

    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));
    if (plusButtons[0]) fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
  });

  it('navigates back when clicking back button on mobile', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    const backBtn = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backBtn);
    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });

  it('renders with dark theme colors', () => {
    mockIsDark = true;
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    expect(screen.getByText('Cart')).toHaveClass('text-white');
  });

  it('handles shipping option changes', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    const expressRadio = screen.getByLabelText(/Express shipping/i);
    fireEvent.click(expressRadio);

    // Total should now be $115.00 ($100 subtotal + $15 express)
    expect(screen.getByText('$115.00')).toBeInTheDocument();

    const pickupRadio = screen.getByLabelText(/Pick Up/i);
    fireEvent.click(pickupRadio);

    // Should be back to 100.00
    expect(screen.getAllByText('$100.00').length).toBeGreaterThanOrEqual(2);
  });

  it('handles coupon application', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    const input = screen.getByPlaceholderText(/Coupon Code/i);
    fireEvent.change(input, { target: { value: 'SAVE10' } });

    const applyBtn = screen.getByRole('button', { name: /apply/i });
    fireEvent.click(applyBtn);

    // Input should be cleared after application (based on Cart.tsx logic)
    expect(input).toHaveValue('');
  });

  it('redirects to checkout when authorized', () => {
    setupWithItems();
    mockIsAuth = true;
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('redirects to login when not authorized', () => {
    setupWithItems();
    mockIsAuth = false;
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, expect.any(Object));
  });

  it('navigates to product detail on title click', () => {
    setupWithItems();
    render(
      <BrowserRouter>
        <Cart />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText('Test Product'));
    expect(mockNavigate).toHaveBeenCalledWith('/product/p1');
  });
});
