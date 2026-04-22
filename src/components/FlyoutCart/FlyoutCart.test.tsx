import { BrowserRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useCartStore } from '@/store/useCartStore';

import { FlyoutCart } from './FlyoutCart';

// ─── Navigation ───────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Auth ──────────────────────────────────────────────────────────────────────
let mockIsAuth = false;
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: mockIsAuth }),
}));

// ─── Theme ─────────────────────────────────────────────────────────────────────
let mockIsDark = false;
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: mockIsDark }),
}));

// ─── Toast ─────────────────────────────────────────────────────────────────────
vi.mock('react-hot-toast', () => ({
  default: { success: vi.fn(), error: vi.fn() },
}));

// ─── Cart store ────────────────────────────────────────────────────────────────
const mockCloseCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();
const mockClearCart = vi.fn();
const mockGetCartTotal = vi.fn(() => 100);

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

// ─── Helpers ───────────────────────────────────────────────────────────────────
const baseStore = (overrides = {}) => ({
  items: [],
  isOpen: true,
  clearCart: mockClearCart,
  closeCart: mockCloseCart,
  updateQuantity: mockUpdateQuantity,
  removeItem: mockRemoveItem,
  getCartTotal: mockGetCartTotal,
  ...overrides,
});

const makeItem = ({
  useMongoId = false,
  quantity = 2,
  imageUrl = undefined,
  categories = undefined,
}: {
  useMongoId?: boolean;
  quantity?: number;
  imageUrl?: string;
  categories?: string[];
} = {}) => ({
  product: {
    id: useMongoId ? undefined : 'p1',
    _id: useMongoId ? 'p1' : undefined,
    title: 'Test Product',
    price: 50,
    status: 'active',
    ...(imageUrl !== undefined ? { imageUrl } : {}),
    ...(categories !== undefined ? { categories } : {}),
  },
  quantity,
});

const renderCart = () =>
  render(
    <BrowserRouter>
      <FlyoutCart />
    </BrowserRouter>,
  );

// ─── Tests ─────────────────────────────────────────────────────────────────────
describe('FlyoutCart component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuth = false;
    mockIsDark = false;
    vi.mocked(useCartStore).mockReturnValue(baseStore());
  });

  // Visibility
  it('renders nothing when the cart is closed', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ isOpen: false }));
    const { container } = renderCart();
    expect(container.firstChild).toBeNull();
  });

  it('renders the cart panel when open', () => {
    renderCart();
    expect(screen.getByText('Cart')).toBeInTheDocument();
  });

  // Empty state
  it('shows "Your cart is empty." when there are no items', () => {
    renderCart();
    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
  });

  it('does not render the checkout/view-cart footer when cart is empty', () => {
    renderCart();
    expect(screen.queryByRole('button', { name: /checkout/i })).toBeNull();
    expect(screen.queryByRole('button', { name: /view cart/i })).toBeNull();
  });

  // Close interactions
  it('calls closeCart when the backdrop overlay is clicked', () => {
    renderCart();
    // The overlay is the first sibling div (fixed inset-0 bg-black/40)
    const overlay = document.querySelector('.bg-black\\/40') as HTMLElement;
    fireEvent.click(overlay);
    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });

  it('calls closeCart when the header X button is clicked', () => {
    renderCart();
    // First button in the DOM = the header X close button
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    expect(mockCloseCart).toHaveBeenCalledTimes(1);
  });

  // Item rendering
  it('renders cart items with title, price and quantity', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem()], getCartTotal: vi.fn(() => 200) }),
    );
    renderCart();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$100.00')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('renders the product image when imageUrl is provided', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({
        items: [makeItem({ imageUrl: 'https://example.com/img.png' })],
      }),
    );
    renderCart();
    const img = screen.getByRole('img', { name: /test product/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/img.png');
  });

  it('renders the "No img" placeholder when imageUrl is absent', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ imageUrl: undefined })] }),
    );
    renderCart();
    expect(screen.getByText('No img')).toBeInTheDocument();
  });

  it('renders the product title as a link to the product page', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({
        items: [makeItem({ categories: ['Electronics', 'Gadgets'] })],
      }),
    );
    renderCart();
    expect(screen.getByRole('link', { name: 'Test Product' })).toHaveAttribute(
      'href',
      ROUTES.PRODUCT.replace(':id', 'p1'),
    );
  });

  it('renders Subtotal and Total when items are present', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
    // getCartTotal returns 100
    expect(screen.getAllByText('$100.00').length).toBeGreaterThanOrEqual(2);
  });

  // Remove item
  it('calls removeItem with the product id when the per-item X button is clicked', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    const removeBtn = screen
      .getAllByRole('button')
      .filter((button) => button.querySelector('.lucide-x'))[1];
    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('calls removeItem with _id when product uses _id', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ useMongoId: true })] }),
    );
    renderCart();
    const removeBtn = screen
      .getAllByRole('button')
      .filter((button) => button.querySelector('.lucide-x'))[1];
    fireEvent.click(removeBtn);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  // Quantity controls
  it('calls updateQuantity with quantity + 1 when + button is clicked', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ quantity: 2 })] }),
    );
    renderCart();
    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));
    fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
  });

  it('calls updateQuantity with quantity - 1 when – button is clicked', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ quantity: 3 })] }),
    );
    renderCart();
    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    fireEvent.click(minusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 2);
  });

  it('disables the – button when quantity is 1', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ quantity: 1 })] }),
    );
    renderCart();
    const minusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-minus'));
    minusButtons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('calls updateQuantity using _id when product uses _id', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ useMongoId: true, quantity: 2 })] }),
    );
    renderCart();
    const plusButtons = screen
      .getAllByRole('button')
      .filter((b) => b.querySelector('.lucide-plus'));
    fireEvent.click(plusButtons[0]);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
  });

  // Checkout handler
  it('handleCheckout – unauthenticated: closes cart and navigates to login', () => {
    mockIsAuth = false;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockCloseCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, {
      state: { from: ROUTES.CART },
    });
  });

  it('handleCheckout – authenticated: closes cart and navigates to /checkout', () => {
    mockIsAuth = true;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockCloseCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  // View Cart handler
  it('handleViewCart – closes cart and navigates to ROUTES.CART', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /view cart/i }));
    expect(mockCloseCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CART);
  });

  // Dark mode theme
  it('applies dark mode classes when isDark is true', () => {
    mockIsDark = true;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    // The h2 heading should have text-white class in dark mode
    expect(screen.getByText('Cart')).toHaveClass('text-white');
  });

  it('applies light mode classes when isDark is false', () => {
    mockIsDark = false;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    expect(screen.getByText('Cart')).toHaveClass('text-black');
  });

  it('applies dark mode classes to empty cart message', () => {
    mockIsDark = true;
    renderCart();
    const emptyMsg = screen.getByText('Your cart is empty.');
    // The text is a direct child of the div that holds the dark-mode class
    const wrapper = emptyMsg.closest('[class*="text-gray"]');
    expect(wrapper).toHaveClass('text-gray-400');
  });

  // Clear all button
  it('does not render the "Clear all" button when cart is empty', () => {
    renderCart();
    expect(screen.queryByRole('button', { name: /clear all/i })).toBeNull();
  });

  it('renders the "Clear all" button when cart has items', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    expect(
      screen.getByRole('button', { name: /clear all/i }),
    ).toBeInTheDocument();
  });

  it('calls clearCart when "Clear all" is clicked', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderCart();
    fireEvent.click(screen.getByRole('button', { name: /clear all/i }));
    expect(mockClearCart).toHaveBeenCalledTimes(1);
  });
});
