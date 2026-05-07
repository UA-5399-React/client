import { BrowserRouter } from 'react-router-dom';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useCartStore } from '@/store/useCartStore';

import { FlyoutCart } from './FlyoutCart';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

let mockIsAuth = false;
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({ isAuth: mockIsAuth }),
}));

let mockIsDark = false;
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: mockIsDark }),
}));

const mockShowMessage = vi.fn();
vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn(
    (selector: (s: { show: typeof mockShowMessage }) => unknown) =>
      selector({ show: mockShowMessage }),
  ),
}));

const mockCloseCart = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockRemoveItem = vi.fn();
const mockClearCart = vi.fn();
const mockGetCartTotal = vi.fn(() => 100);

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

type ItemFactoryParams = {
  useMongoId?: boolean;
  quantity?: number;
  imageUrl?: string;
};

const makeItem = ({
  useMongoId = false,
  quantity = 2,
  imageUrl,
}: ItemFactoryParams = {}) => ({
  product: {
    id: useMongoId ? undefined : 'p1',
    _id: useMongoId ? 'p1' : undefined,
    title: 'Test Product',
    price: 50,
    status: 'active',
    ...(imageUrl ? { imageUrl } : {}),
  },
  quantity,
});

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

const renderFlyoutCart = () =>
  render(
    <BrowserRouter>
      <FlyoutCart />
    </BrowserRouter>,
  );

describe('FlyoutCart', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockIsAuth = false;
    mockIsDark = false;
    vi.mocked(useCartStore).mockReturnValue(baseStore());
  });

  it('does not render when cart is closed', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ isOpen: false }));

    const { container } = renderFlyoutCart();

    expect(container.firstChild).toBeNull();
  });

  it('shows empty state for cart without items', () => {
    renderFlyoutCart();

    expect(screen.getByText('Your cart is empty.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /checkout/i })).toBeNull();
  });

  it('renders item information and totals', () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));

    renderFlyoutCart();

    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getAllByText('$100.00')).not.toHaveLength(0);
    expect(screen.getByText('Subtotal')).toBeInTheDocument();
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('closes cart on backdrop click and on close button click', async () => {
    renderFlyoutCart();
    const user = userEvent.setup();

    const backdrop = document.querySelector('.bg-black\\/40');
    if (!backdrop) {
      throw new Error('Backdrop was not rendered');
    }

    await user.click(backdrop as HTMLElement);
    await user.click(screen.getByRole('button', { name: /close cart/i }));

    expect(mockCloseCart).toHaveBeenCalledTimes(2);
  });

  it('updates quantity and removes item using product id', async () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ quantity: 2 })] }),
    );
    renderFlyoutCart();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: /increase quantity for test product/i,
      }),
    );
    await user.click(
      screen.getByRole('button', {
        name: /decrease quantity for test product/i,
      }),
    );
    await user.click(
      screen.getByRole('button', { name: /remove test product/i }),
    );

    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 1);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('uses _id as a fallback for actions', async () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ useMongoId: true, quantity: 2 })] }),
    );
    renderFlyoutCart();
    const user = userEvent.setup();

    await user.click(
      screen.getByRole('button', {
        name: /increase quantity for test product/i,
      }),
    );
    await user.click(
      screen.getByRole('button', { name: /remove test product/i }),
    );

    expect(mockUpdateQuantity).toHaveBeenCalledWith('p1', 3);
    expect(mockRemoveItem).toHaveBeenCalledWith('p1');
  });

  it('disables decrease button for quantity 1', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ quantity: 1 })] }),
    );
    renderFlyoutCart();

    expect(
      screen.getByRole('button', {
        name: /decrease quantity for test product/i,
      }),
    ).toBeDisabled();
  });

  it('navigates to product page when item row is clicked', async () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderFlyoutCart();
    const user = userEvent.setup();

    const row = screen.getByText('Test Product').closest('.cursor-pointer');
    if (!row) {
      throw new Error('Item row was not rendered');
    }

    await user.click(row);

    expect(mockCloseCart).toHaveBeenCalled();
    expect(mockNavigate).toHaveBeenCalledWith(
      ROUTES.PRODUCT.replace(':id', 'p1'),
    );
  });

  it('navigates guest to login on checkout', async () => {
    const user = userEvent.setup();

    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    mockIsAuth = false;
    renderFlyoutCart();
    await user.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN, {
      state: { from: ROUTES.CART },
    });
  });

  it('navigates authenticated user to checkout', async () => {
    const user = userEvent.setup();

    vi.clearAllMocks();
    mockIsAuth = true;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderFlyoutCart();
    await user.click(screen.getByRole('button', { name: /checkout/i }));
    expect(mockNavigate).toHaveBeenCalledWith('/checkout');
  });

  it('handles view cart and clear all actions', async () => {
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderFlyoutCart();
    const user = userEvent.setup();

    await user.click(screen.getByRole('button', { name: /clear all/i }));
    await user.click(screen.getByRole('button', { name: /view cart/i }));

    expect(mockClearCart).toHaveBeenCalledTimes(1);
    expect(mockShowMessage).toHaveBeenCalledWith(
      'success',
      'Success!',
      'Cart cleared',
    );
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CART);
  });

  it('applies dark theme styles', () => {
    mockIsDark = true;
    vi.mocked(useCartStore).mockReturnValue(baseStore({ items: [makeItem()] }));
    renderFlyoutCart();

    expect(screen.getByText('Cart')).toHaveClass('text-white');

    const productRow = screen
      .getByText('Test Product')
      .closest('.cursor-pointer');
    if (!productRow) {
      throw new Error('Product row was not rendered');
    }

    const price = within(productRow as HTMLElement).getByText('$100.00');
    expect(price).toHaveClass('font-semibold');
  });

  it('renders image placeholder when product image is missing', () => {
    vi.mocked(useCartStore).mockReturnValue(
      baseStore({ items: [makeItem({ imageUrl: undefined })] }),
    );
    renderFlyoutCart();

    expect(screen.getByText('No img')).toBeInTheDocument();
  });
});
