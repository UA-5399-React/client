import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  GroupTableFilter,
  type GroupTableFilterState,
} from './GroupTableFilter';

vi.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="icon-calendar" />,
  Check: () => <svg data-testid="icon-check" />,
  RotateCcw: () => <svg data-testid="icon-rotate" />,
}));

describe('GroupTableFilter', () => {
  const mockOnClose = vi.fn();
  const mockOnApply = vi.fn();

  const defaultInitial: GroupTableFilterState = {
    dateFrom: '2026-04-10',
    dateTo: '2026-04-20',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-01T12:00:00Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <GroupTableFilter
        isOpen={false}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('renders correctly when isOpen is true', () => {
    render(
      <GroupTableFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    expect(screen.getByText('Date range')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Apply' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset' })).toBeInTheDocument();
    expect(screen.getByTitle('Reset date')).toBeInTheDocument();

    expect(screen.getByDisplayValue('2026-04-10')).toBeInTheDocument();
    expect(screen.getByDisplayValue('2026-04-20')).toBeInTheDocument();
  });

  it('allows changing dates and calls onApply with new values', () => {
    const { container } = render(
      <GroupTableFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const inputs = container.querySelectorAll('input[type="date"]');
    const fromInput = inputs[0] as HTMLInputElement;
    const toInput = inputs[1] as HTMLInputElement;

    fireEvent.change(fromInput, { target: { value: '2026-04-05' } });
    fireEvent.change(toInput, { target: { value: '2026-04-25' } });

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(mockOnApply).toHaveBeenCalledWith({
      dateFrom: '2026-04-05',
      dateTo: '2026-04-25',
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('resets dates to default when clicking the Reset button', () => {
    render(
      <GroupTableFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const resetButton = screen.getByRole('button', { name: 'Reset' });
    fireEvent.click(resetButton);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      dateFrom: '2026-04-01',
      dateTo: '2026-05-01',
    });
  });

  it('resets dates when clicking the top icon (Reset date)', () => {
    render(
      <GroupTableFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const iconResetButton = screen.getByTitle('Reset date');
    fireEvent.click(iconResetButton);

    const applyButton = screen.getByRole('button', { name: 'Apply' });
    fireEvent.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledWith({
      dateFrom: '2026-04-01',
      dateTo: '2026-05-01',
    });
  });

  it('closes the modal when clicking the backdrop and does not call onApply', () => {
    const { container } = render(
      <GroupTableFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const backdrop = container.querySelector('.fixed.inset-0');
    expect(backdrop).toBeInTheDocument();

    if (backdrop) {
      fireEvent.click(backdrop);
    }

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockOnApply).not.toHaveBeenCalled();
  });
});
