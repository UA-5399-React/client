import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { orderService, paymentService } from '@/services';
import { useCartStore } from '@/store/useCartStore';
import { redirectToExternalUrl } from '@/utils/navigation';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { Checkout } from './Checkout';

const mockNavigate = vi.fn();
const mockClearCart = vi.fn();
const mockRemoveItem = vi.fn();
const mockUpdateQuantity = vi.fn();

const validCartItem = {
  product: {
    _id: '507f1f77bcf86cd799439011',
    id: '507f1f77bcf86cd799439011',
    title: 'Tray Table',
    price: 38,
    status: 'active' as const,
    imageUrl: 'https://example.com/tray-table.jpg',
    categories: ['Black'],
  },
  quantity: 2,
};

let mockCartState = {
  items: [validCartItem],
  clearCart: mockClearCart,
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  getCartTotal: () => 76,
};

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

vi.mock('@/services', () => ({
  orderService: {
    createOrder: vi.fn(),
  },
  paymentService: {
    createCheckoutSession: vi.fn(),
    getSessionStatus: vi.fn(),
  },
}));

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn((selector?: (state: typeof mockCartState) => unknown) =>
    selector ? selector(mockCartState) : mockCartState,
  ),
}));

vi.mock('@/utils/navigation', () => ({
  redirectToExternalUrl: vi.fn(),
}));

const fillRequiredFields = async () => {
  const user = userEvent.setup();

  await user.type(screen.getByPlaceholderText('First name'), 'John');
  await user.type(screen.getByPlaceholderText('Last name'), 'Doe');
  await user.type(screen.getByPlaceholderText('Phone number'), '+380501234567');
  await user.type(
    screen.getByPlaceholderText('Email address'),
    'john@example.com',
  );
  await user.type(screen.getByPlaceholderText('Town / City'), 'Kyiv');
  await user.type(screen.getByPlaceholderText('Department code'), '42');

  return user;
};

describe('Page: Checkout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    mockCartState = {
      items: [validCartItem],
      clearCart: mockClearCart,
      removeItem: mockRemoveItem,
      updateQuantity: mockUpdateQuantity,
      getCartTotal: () => 76,
    };

    (useTheme as unknown as Mock).mockReturnValue({ isDark: false });
    (useCartStore as unknown as Mock).mockImplementation(
      (selector?: (state: typeof mockCartState) => unknown) =>
        selector ? selector(mockCartState) : mockCartState,
    );
    (orderService.createOrder as Mock).mockResolvedValue({
      orderId: 'ORD-20260325-0001',
      items: [
        {
          product: validCartItem.product._id,
          title: validCartItem.product.title,
          imageUrl: validCartItem.product.imageUrl,
          unitPrice: validCartItem.product.price,
          amount: validCartItem.quantity,
        },
      ],
      totalPrice: 76,
      amount: 76,
    });
    (paymentService.createCheckoutSession as Mock).mockResolvedValue({
      sessionId: 'cs_test_123',
      sessionUrl: 'https://checkout.stripe.com/c/pay/cs_test_123',
    });
  });

  it('renders checkout sections, summary, total note, and autofill-friendly inputs', () => {
    render(<Checkout />);

    expect(screen.getByText('Contact Infomation')).toBeInTheDocument();
    expect(screen.getByText('Shipping Address')).toBeInTheDocument();
    expect(screen.getByText('Payment method')).toBeInTheDocument();
    expect(screen.getAllByText('Order summary')).toHaveLength(2);
    expect(
      screen.getAllByText('Final price may change depending on delivery cost.'),
    ).toHaveLength(2);

    expect(screen.getByPlaceholderText('First name')).toHaveAttribute(
      'autocomplete',
      'given-name',
    );
    expect(screen.getByPlaceholderText('Last name')).toHaveAttribute(
      'autocomplete',
      'family-name',
    );
    expect(screen.getByPlaceholderText('Phone number')).toHaveAttribute(
      'autocomplete',
      'tel',
    );
    expect(screen.getByPlaceholderText('Email address')).toHaveAttribute(
      'autocomplete',
      'email',
    );

    const deliverySelect = screen.getByRole('combobox');
    expect(deliverySelect).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Нова Пошта' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('option', { name: 'Укрпошта' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Meest' })).toBeInTheDocument();
  });

  it('shows Stripe info only for card payments and switches CTA copy', async () => {
    const user = userEvent.setup();

    render(<Checkout />);

    expect(
      screen.getByText('Card details are entered securely on Stripe.'),
    ).toBeInTheDocument();
    expect(
      screen.queryByPlaceholderText('1234 1234 1234'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue to Stripe' }),
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText('Cash on delivery'));
    expect(
      screen.queryByText('Card details are entered securely on Stripe.'),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Place Order' }),
    ).toBeInTheDocument();

    await user.click(screen.getByLabelText('Pay with card securely'));
    expect(
      screen.getByText('Card details are entered securely on Stripe.'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Continue to Stripe' }),
    ).toBeInTheDocument();
  });

  it('blocks submit when a cart item has no valid backend product id', async () => {
    mockCartState = {
      ...mockCartState,
      items: [
        {
          ...validCartItem,
          product: {
            ...validCartItem.product,
            _id: '',
            id: 'local-product-id',
          },
        },
      ],
      getCartTotal: () => 76,
    };

    (useCartStore as unknown as Mock).mockImplementation(
      (selector?: (state: typeof mockCartState) => unknown) =>
        selector ? selector(mockCartState) : mockCartState,
    );

    render(<Checkout />);

    const user = await fillRequiredFields();
    await user.click(
      screen.getByRole('button', { name: 'Continue to Stripe' }),
    );

    expect(
      await screen.findByText(
        'Some cart items cannot be checked out because they are missing a valid product ID.',
      ),
    ).toBeInTheDocument();
    expect(orderService.createOrder).not.toHaveBeenCalled();
  });

  it('syncs restored browser values after returning to checkout and submits them correctly', async () => {
    render(<Checkout />);

    const firstNameInput = screen.getByPlaceholderText(
      'First name',
    ) as HTMLInputElement;
    const lastNameInput = screen.getByPlaceholderText(
      'Last name',
    ) as HTMLInputElement;
    const phoneInput = screen.getByPlaceholderText(
      'Phone number',
    ) as HTMLInputElement;
    const emailInput = screen.getByPlaceholderText(
      'Email address',
    ) as HTMLInputElement;
    const cityInput = screen.getByPlaceholderText(
      'Town / City',
    ) as HTMLInputElement;
    const branchInput = screen.getByPlaceholderText(
      'Department code',
    ) as HTMLInputElement;

    firstNameInput.value = 'Pavlo';
    lastNameInput.value = 'Cat';
    phoneInput.value = '+380501112233';
    emailInput.value = 'customer@test.com';
    cityInput.value = 'Kyiv';
    branchInput.value = '12';

    window.dispatchEvent(new Event('pageshow'));

    const user = userEvent.setup();
    await user.click(
      screen.getByRole('button', { name: 'Continue to Stripe' }),
    );

    await waitFor(() => {
      expect(
        screen.queryByText('Phone number is required'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByText('Email address is required'),
      ).not.toBeInTheDocument();
      expect(orderService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          user: expect.objectContaining({
            firstName: 'Pavlo',
            lastName: 'Cat',
            phone: '+380501112233',
            email: 'customer@test.com',
          }),
          shippingAddress: expect.objectContaining({
            city: 'Kyiv',
            branchNumber: '12',
          }),
        }),
      );
    });
  });

  it('creates a cash-on-delivery order, clears the cart, and navigates to confirmation', async () => {
    render(<Checkout />);

    const user = await fillRequiredFields();
    await user.click(screen.getByLabelText('Cash on delivery'));
    await user.click(screen.getByRole('button', { name: 'Place Order' }));

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: 'cash_on_delivery',
          user: expect.objectContaining({
            email: 'john@example.com',
          }),
          shippingAddress: expect.objectContaining({
            city: 'Kyiv',
            branchNumber: '42',
          }),
        }),
      );
      expect(mockClearCart).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ORDER_CONFIRMATION, {
        state: expect.objectContaining({
          paymentStatus: 'pending',
          orderSnapshot: expect.objectContaining({
            orderId: 'ORD-20260325-0001',
            paymentMethod: 'cash_on_delivery',
          }),
        }),
      });
    });
  });

  it('creates an online order, starts Stripe checkout, and keeps the cart intact until confirmation', async () => {
    render(<Checkout />);

    const user = await fillRequiredFields();
    await user.click(
      screen.getByRole('button', { name: 'Continue to Stripe' }),
    );

    await waitFor(() => {
      expect(orderService.createOrder).toHaveBeenCalledWith(
        expect.objectContaining({
          paymentMethod: 'stripe',
        }),
      );
      expect(paymentService.createCheckoutSession).toHaveBeenCalledWith(
        [
          expect.objectContaining({
            productId: validCartItem.product._id,
            quantity: validCartItem.quantity,
          }),
        ],
        'ORD-20260325-0001',
      );
      expect(
        (orderService.createOrder as Mock).mock.calls[0][0],
      ).not.toHaveProperty('cardNumber');
      expect(
        (orderService.createOrder as Mock).mock.calls[0][0],
      ).not.toHaveProperty('expirationDate');
      expect(
        (orderService.createOrder as Mock).mock.calls[0][0],
      ).not.toHaveProperty('cvc');
      expect(mockClearCart).not.toHaveBeenCalled();
      expect(redirectToExternalUrl).toHaveBeenCalledWith(
        'https://checkout.stripe.com/c/pay/cs_test_123',
      );
    });
  });
});
