import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ORDER_STATUS } from '@/types/tableOrders.types';

import { OrdersTopWidgets } from './OrdersTopWidgets';

describe('OrdersTopWidgets', () => {
  const mockCounts = {
    [ORDER_STATUS.NEW]: 5,
    [ORDER_STATUS.COMPLETED]: 120,
    [ORDER_STATUS.CANCELLED]: 55,
    [ORDER_STATUS.PROCESSING]: 2,
  };

  it('renders all widget labels correctly', () => {
    render(<OrdersTopWidgets counts={mockCounts} loading={false} />);

    expect(screen.getByText('Total New Orders')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Cancelled')).toBeInTheDocument();
    expect(screen.getByText('Processing')).toBeInTheDocument();
  });

  it('displays correct counter values when loading is finished', () => {
    render(<OrdersTopWidgets counts={mockCounts} loading={false} />);

    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('120')).toBeInTheDocument();
    expect(screen.getByText('55')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
  });

  it('shows ellipsis instead of numbers when loading is true', () => {
    render(<OrdersTopWidgets counts={mockCounts} loading={true} />);

    const loaders = screen.getAllByText('...');
    expect(loaders).toHaveLength(4);
  });

  it('renders zero if a status value is missing in counts prop', () => {
    const incompleteCounts = { [ORDER_STATUS.NEW]: 10 };
    render(<OrdersTopWidgets counts={incompleteCounts} loading={false} />);

    expect(screen.getByText('10')).toBeInTheDocument();
    const zeroValues = screen.getAllByText('0');
    expect(zeroValues.length).toBeGreaterThanOrEqual(3);
  });

  it('has the correct visual structure for icon rings', () => {
    const { container } = render(
      <OrdersTopWidgets counts={mockCounts} loading={false} />,
    );

    const iconContainers = container.querySelectorAll('.h-14.w-14');
    expect(iconContainers).toHaveLength(4);

    const icons = container.querySelectorAll('svg');
    expect(icons.length).toBeGreaterThanOrEqual(4);
  });
});
