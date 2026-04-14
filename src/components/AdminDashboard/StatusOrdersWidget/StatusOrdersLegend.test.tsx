import { describe, expect, it, vi } from 'vitest';

import type { OrderStatusSegment } from '@/types';
import { render, screen } from '@/utils/test-utils';

import { StatusOrdersLegend } from './StatusOrdersLegend';

vi.mock('./constants', () => ({
  STATUS_COLORS: {
    new: '#3b82f6',
    processing: '#f59e0b',
    completed: '#10b981',
    cancelled: '#ef4444',
  },
  STATUS_LABELS: {
    new: 'Нове замовлення',
    processing: 'В обробці',
    completed: 'Успішно завершено',
    cancelled: 'Скасовано',
  },
  LEFT_COL: ['new', 'processing'],
  RIGHT_COL: ['completed', 'cancelled'],
}));

describe('UI Component: StatusOrdersLegend', () => {
  const mockStatuses: OrderStatusSegment[] = [
    { status: 'new', count: 10, percentage: 25 },
    { status: 'completed', count: 30, percentage: 75 },
  ];

  it('should render only the statuses present in the statuses prop', () => {
    render(<StatusOrdersLegend statuses={mockStatuses} />);

    expect(screen.getByText('Нове замовлення')).toBeInTheDocument();
    expect(screen.getByText('Успішно завершено')).toBeInTheDocument();

    expect(screen.queryByText('В обробці')).not.toBeInTheDocument();
    expect(screen.queryByText('Скасовано')).not.toBeInTheDocument();
  });

  it('should apply the correct background colors to the indicators', () => {
    render(<StatusOrdersLegend statuses={mockStatuses} />);

    const newLabel = screen.getByText('Нове замовлення');
    const newContainer = newLabel.parentElement;
    const newColorIndicator = newContainer?.querySelector('.rounded-full');

    expect(newColorIndicator).toHaveStyle({ backgroundColor: '#3b82f6' });

    const completedLabel = screen.getByText('Успішно завершено');
    const completedContainer = completedLabel.parentElement;
    const completedColorIndicator =
      completedContainer?.querySelector('.rounded-full');

    expect(completedColorIndicator).toHaveStyle({ backgroundColor: '#10b981' });
  });

  it('should render empty layout without errors if statuses array is empty', () => {
    const { container } = render(<StatusOrdersLegend statuses={[]} />);

    expect(screen.queryByText('Нове замовлення')).not.toBeInTheDocument();
    expect(screen.queryByText('Успішно завершено')).not.toBeInTheDocument();

    const divs = container.querySelectorAll('div');
    expect(divs.length).toBe(3);
  });
});
