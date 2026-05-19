import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import type { Order } from '@/types/order.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { OrderCard } from './OrderCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const orderDetailPath = (orderId: string) =>
  ROUTES.ORDER_DETAIL.replace(':orderId', orderId);

const mockOrderCompleted: Order = {
  id: '1',
  orderNumber: '#3456_980',
  createdAt: 'October 11, 2023',
  status: 'completed',
  totalPrice: 345.0,
};

const mockOrderProcessed: Order = {
  id: '2',
  orderNumber: '#3456_768',
  createdAt: 'December 1, 2025',
  status: 'processed',
  totalPrice: 1234.0,
};

const mockOrderShipped: Order = {
  id: '3',
  orderNumber: '#3456_230',
  createdAt: 'April 13, 2023',
  status: 'shipped',
  totalPrice: 120.0,
};

const mockOrderNew: Order = {
  id: '4',
  orderNumber: '#3456_120',
  createdAt: 'January 14, 2023',
  status: 'new',
  totalPrice: 50.0,
};

const mockOrderCancelled: Order = {
  id: '5',
  orderNumber: '#3456_050',
  createdAt: 'March 5, 2023',
  status: 'cancelled',
  totalPrice: 75.0,
};

describe('UI Component: OrderCard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('order info', () => {
    it('renders order number and price', () => {
      render(<OrderCard order={mockOrderCompleted} />);

      expect(screen.getAllByText('#3456_980')[0]).toBeInTheDocument();
      expect(screen.getAllByText('$345.00')[0]).toBeInTheDocument();
    });

    it.each([
      { order: mockOrderCompleted, label: 'Completed' },
      { order: mockOrderCancelled, label: 'Cancelled' },
      { order: mockOrderProcessed, label: 'In progress' },
      { order: mockOrderShipped, label: 'In progress' },
    ])('renders status label "$label"', ({ order, label }) => {
      render(<OrderCard order={order} />);

      expect(screen.getAllByText(label)[0]).toBeInTheDocument();
    });
  });

  describe('date formatting', () => {
    it.each([
      { order: mockOrderCompleted, expected: 'October 11, 2023' },
      { order: mockOrderCancelled, expected: 'March 5, 2023' },
    ])(
      'renders date without Exp. prefix for $expected',
      ({ order, expected }) => {
        render(<OrderCard order={order} />);

        expect(screen.getAllByText(expected)[0]).toBeInTheDocument();
      },
    );

    it.each([
      { order: mockOrderNew, expected: 'Exp. January 14, 2023' },
      { order: mockOrderProcessed, expected: 'Exp. December 1, 2025' },
      { order: mockOrderShipped, expected: 'Exp. April 13, 2023' },
    ])(
      'renders date with Exp. prefix for pending orders',
      ({ order, expected }) => {
        render(<OrderCard order={order} />);

        expect(screen.getAllByText(expected)[0]).toBeInTheDocument();
      },
    );

    it('renders em dash when createdAt is undefined', () => {
      render(
        <OrderCard order={{ ...mockOrderCompleted, createdAt: undefined }} />,
      );

      expect(screen.getAllByText('—')[0]).toBeInTheDocument();
    });
  });

  describe('Details button', () => {
    it('shows Details button for completed orders', () => {
      render(<OrderCard order={mockOrderCompleted} />);

      expect(screen.getAllByText('Details').length).toBeGreaterThan(0);
    });

    it('shows Details button below progress bar for in-progress orders', () => {
      render(<OrderCard order={mockOrderShipped} />);

      expect(screen.getByText('Processed')).toBeInTheDocument();
      expect(screen.getAllByText('Details').length).toBeGreaterThan(0);
    });

    it.each([
      { order: mockOrderCompleted, expectedPath: orderDetailPath('1') },
      { order: mockOrderShipped, expectedPath: orderDetailPath('3') },
    ])(
      'navigates to order details on Details click ($expectedPath)',
      async ({ order, expectedPath }) => {
        const user = userEvent.setup();
        render(<OrderCard order={order} />);

        await user.click(screen.getAllByText('Details')[0]);

        expect(mockNavigate).toHaveBeenCalledTimes(1);
        expect(mockNavigate).toHaveBeenCalledWith(expectedPath);
      },
    );
  });

  describe('progress bar', () => {
    it('renders progress bar for processed status', () => {
      render(<OrderCard order={mockOrderProcessed} />);

      expect(screen.getByText('Processed')).toBeInTheDocument();
      expect(screen.getByText('En Route')).toBeInTheDocument();
      expect(screen.getAllByText('Completed')[0]).toBeInTheDocument();
    });

    it('does not render progress bar for completed status', () => {
      render(<OrderCard order={mockOrderCompleted} />);

      expect(screen.queryByText('En Route')).not.toBeInTheDocument();
    });
  });
});
