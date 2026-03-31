import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { useTheme } from '@/hooks/useTheme';
import { paymentService } from '@/services';
import { checkoutStorage } from '@/utils/checkoutStorage';

import { OrderConfirmation } from './OrderConfirmation';

const mockClearCart = vi.fn();

const orderSnapshot = {
  orderId: 'ORD-20260325-0001',
  amount: 76,
  totalPrice: 76,
  paymentMethod: 'cash_on_delivery' as const,
  customerName: 'John Doe',
  items: [
    {
      product: '507f1f77bcf86cd799439011',
      title: 'Tray Table',
      imageUrl: 'https://example.com/tray-table.jpg',
      unitPrice: 38,
      amount: 2,
    },
  ],
};

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
  useCartStore: vi.fn(
    (selector?: (state: { clearCart: typeof mockClearCart }) => unknown) =>
      selector
        ? selector({ clearCart: mockClearCart })
        : { clearCart: mockClearCart },
  ),
}));

describe('Page: OrderConfirmation', () => {
  const createDeferred = <T,>() => {
    let resolve!: (value: T) => void;
    const promise = new Promise<T>((resolver) => {
      resolve = resolver;
    });

    return { promise, resolve };
  };

  const renderPage = (
    initialEntries: Parameters<typeof MemoryRouter>[0]['initialEntries'],
  ) => {
    const queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={initialEntries}>
          <Routes>
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    (useTheme as unknown as Mock).mockReturnValue({ isDark: false });
  });

  it('renders a cash-on-delivery confirmation state from navigation state', async () => {
    renderPage([
      {
        pathname: '/order-confirmation',
        state: {
          orderSnapshot,
          paymentStatus: 'pending',
        },
      },
    ]);

    expect(await screen.findByText('Order confirmed')).toBeInTheDocument();
    expect(screen.getByText('Cash on delivery')).toBeInTheDocument();
    expect(screen.getByText('ORD-20260325-0001')).toBeInTheDocument();
    await waitFor(() => {
      expect(mockClearCart).toHaveBeenCalled();
    });
  });

  it('verifies a Stripe session from query params and shows success after payment', async () => {
    checkoutStorage.save({
      ...orderSnapshot,
      paymentMethod: 'stripe',
    });
    const deferredStatus = createDeferred<{
      status: string;
      paymentStatus: string;
    }>();
    (paymentService.getSessionStatus as Mock).mockReturnValue(
      deferredStatus.promise,
    );

    renderPage(['/order-confirmation?session_id=cs_test_123']);

    expect(
      await screen.findByText('Checking your payment status...'),
    ).toBeInTheDocument();
    expect(
      screen.queryByText('We could not confirm this order'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Back to checkout' }),
    ).not.toBeInTheDocument();

    deferredStatus.resolve({
      status: 'complete',
      paymentStatus: 'paid',
    });

    await waitFor(() => {
      expect(paymentService.getSessionStatus).toHaveBeenCalledWith(
        'cs_test_123',
      );
      expect(screen.getByText('Order confirmed')).toBeInTheDocument();
      expect(screen.getByText('paid')).toBeInTheDocument();
      expect(mockClearCart).toHaveBeenCalled();
    });
  });

  it('shows a retry state when the Stripe session is not complete', async () => {
    checkoutStorage.save({
      ...orderSnapshot,
      paymentMethod: 'stripe',
    });
    (paymentService.getSessionStatus as Mock).mockResolvedValue({
      status: 'open',
      paymentStatus: 'unpaid',
    });

    renderPage(['/order-confirmation?session_id=cs_test_456']);

    await waitFor(() => {
      expect(
        screen.getByText('We could not confirm this order'),
      ).toBeInTheDocument();
      expect(
        screen.getByRole('link', { name: 'Back to checkout' }),
      ).toHaveAttribute('href', '/checkout');
    });

    expect(mockClearCart).not.toHaveBeenCalled();
  });
});
