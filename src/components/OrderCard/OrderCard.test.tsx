import { describe, expect, it, vi } from 'vitest';

import type { Order } from '@/types/order.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { OrderCard } from './OrderCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

const mockOrderDelivered: Order = {
  id: '1',
  orderNumber: '#3456_980',
  createdAt: 'October 11, 2023',
  status: 'completed',
  totalPrice: 345.0,
};

const mockOrderInProgress: Order = {
  id: '2',
  orderNumber: '#3456_768',
  createdAt: 'December 1, 2025',
  status: 'shipping',
  totalPrice: 1234.0,
};

const mockOrderPending: Order = {
  id: '3',
  orderNumber: '#3456_120',
  createdAt: 'January 14, 2023',
  status: 'new',
  totalPrice: 50.0,
};

describe('UI Component: OrderCard', () => {
  it('should render order number and price', () => {
    render(<OrderCard order={mockOrderDelivered} />);

    expect(screen.getByText('#3456_980')).toBeInTheDocument();
    expect(screen.getByText('$345.00')).toBeInTheDocument();
  });

  it('should render correct status label', () => {
    render(<OrderCard order={mockOrderDelivered} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render date without Exp. prefix for completed order', () => {
    render(<OrderCard order={mockOrderDelivered} />);

    expect(screen.getByText('October 11, 2023')).toBeInTheDocument();
  });

  it('should render date with Exp. prefix for pending order', () => {
    render(<OrderCard order={mockOrderPending} />);

    expect(screen.getByText('Exp. January 14, 2023')).toBeInTheDocument();
  });

  it('should render date with Exp. prefix for in progress order', () => {
    render(<OrderCard order={mockOrderInProgress} />);

    expect(screen.getByText('Exp. December 1, 2025')).toBeInTheDocument();
  });

  it('should render — when createdAt is undefined', () => {
    render(
      <OrderCard order={{ ...mockOrderDelivered, createdAt: undefined }} />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should show Details button inline for non-progress orders', () => {
    render(<OrderCard order={mockOrderDelivered} />);

    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should show Details button centered for in progress orders', () => {
    render(<OrderCard order={mockOrderInProgress} />);

    const button = screen.getByText('Details').closest('button');
    expect(button).toBeInTheDocument();
    expect(button?.closest('.justify-center')).toBeInTheDocument();
  });

  it('should navigate to order details on Details click', async () => {
    const user = userEvent.setup();
    render(<OrderCard order={mockOrderDelivered} />);

    await user.click(screen.getByText('Details'));

    expect(mockNavigate).toHaveBeenCalledWith('/order/1');
  });

  it('should show In progress label for shipping status', () => {
    render(<OrderCard order={mockOrderInProgress} />);

    expect(screen.getByText('In progress')).toBeInTheDocument();
  });
});
