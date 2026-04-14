import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { TableSortControl } from './TableSortControl';

vi.mock('@/components', () => ({
  Button: ({
    children,
    ...props
  }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

vi.mock('lucide-react', () => ({
  ArrowUp: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="arrow-up" {...props} />
  ),
  ArrowDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="arrow-down" {...props} />
  ),
  ArrowUpDown: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="arrow-up-down" {...props} />
  ),
}));

describe('TableSortControl', () => {
  it('renders label', () => {
    render(
      <TableSortControl
        label="Price"
        field="price"
        currentSort="title"
        currentOrder="asc"
        onSortChange={vi.fn()}
      />,
    );

    expect(screen.getByRole('button', { name: /price/i })).toBeInTheDocument();
  });

  it('renders ArrowUpDown when column is not active', () => {
    render(
      <TableSortControl
        label="Price"
        field="price"
        currentSort="title"
        currentOrder="asc"
        onSortChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('arrow-up-down')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument();
  });

  it('renders ArrowUp when active sort is asc', () => {
    render(
      <TableSortControl
        label="Price"
        field="price"
        currentSort="price"
        currentOrder="asc"
        onSortChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('arrow-up')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-down')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up-down')).not.toBeInTheDocument();
  });

  it('renders ArrowDown when active sort is desc', () => {
    render(
      <TableSortControl
        label="Price"
        field="price"
        currentSort="price"
        currentOrder="desc"
        onSortChange={vi.fn()}
      />,
    );

    expect(screen.getByTestId('arrow-down')).toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up')).not.toBeInTheDocument();
    expect(screen.queryByTestId('arrow-up-down')).not.toBeInTheDocument();
  });

  it('calls onSortChange with field on click', () => {
    const onSortChange = vi.fn();

    render(
      <TableSortControl
        label="Units Purchased"
        field="purchaseCount"
        currentSort="title"
        currentOrder="asc"
        onSortChange={onSortChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: /units purchased/i }));

    expect(onSortChange).toHaveBeenCalledTimes(1);
    expect(onSortChange).toHaveBeenCalledWith('purchaseCount');
  });
});
