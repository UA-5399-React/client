import { describe, expect, it, vi } from 'vitest';

import type { Order } from '@/types/order.types';
import { render, screen, userEvent } from '@/utils/test-utils';

import { OrderCard } from './OrderCard';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

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
  it('should render order number and price', () => {
    render(<OrderCard order={mockOrderCompleted} />);

    expect(screen.getByText('#3456_980')).toBeInTheDocument();
    expect(screen.getByText('$345.00')).toBeInTheDocument();
  });

  it('should render correct status label for completed', () => {
    render(<OrderCard order={mockOrderCompleted} />);

    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should render correct status label for cancelled', () => {
    render(<OrderCard order={mockOrderCancelled} />);

    expect(screen.getByText('Cancelled')).toBeInTheDocument();
  });

  it('should render In progress label for processed status', () => {
    render(<OrderCard order={mockOrderProcessed} />);

    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('should render In progress label for shipped status', () => {
    render(<OrderCard order={mockOrderShipped} />);

    expect(screen.getByText('In progress')).toBeInTheDocument();
  });

  it('should render date without Exp. prefix for completed order', () => {
    render(<OrderCard order={mockOrderCompleted} />);

    expect(screen.getByText('October 11, 2023')).toBeInTheDocument();
  });

  it('should render date without Exp. prefix for cancelled order', () => {
    render(<OrderCard order={mockOrderCancelled} />);

    expect(screen.getByText('March 5, 2023')).toBeInTheDocument();
  });

  it('should render date with Exp. prefix for new order', () => {
    render(<OrderCard order={mockOrderNew} />);

    expect(screen.getByText('Exp. January 14, 2023')).toBeInTheDocument();
  });

  it('should render date with Exp. prefix for processed order', () => {
    render(<OrderCard order={mockOrderProcessed} />);

    expect(screen.getByText('Exp. December 1, 2025')).toBeInTheDocument();
  });

  it('should render date with Exp. prefix for shipped order', () => {
    render(<OrderCard order={mockOrderShipped} />);

    expect(screen.getByText('Exp. April 13, 2023')).toBeInTheDocument();
  });

  it('should render — when createdAt is undefined', () => {
    render(
      <OrderCard order={{ ...mockOrderCompleted, createdAt: undefined }} />,
    );

    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('should show Details button for non-progress orders', () => {
    render(<OrderCard order={mockOrderCompleted} />);

    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should show Details button below progress bar for in progress orders', () => {
    render(<OrderCard order={mockOrderShipped} />);

    expect(screen.getByText('Processed')).toBeInTheDocument();
    expect(screen.getByText('Details')).toBeInTheDocument();
  });

  it('should navigate to order details on Details click', async () => {
    const user = userEvent.setup();
    render(<OrderCard order={mockOrderCompleted} />);

    await user.click(screen.getByText('Details'));

    expect(mockNavigate).toHaveBeenCalledWith('/order/1');
  });

  it('should render progress bar for processed status', () => {
    render(<OrderCard order={mockOrderProcessed} />);

    expect(screen.getByText('Processed')).toBeInTheDocument();
    expect(screen.getByText('En Route')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });

  it('should NOT render progress bar for completed status', () => {
    render(<OrderCard order={mockOrderCompleted} />);

    expect(screen.queryByText('En Route')).not.toBeInTheDocument();
  });
});
