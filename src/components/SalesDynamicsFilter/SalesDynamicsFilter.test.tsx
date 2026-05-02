import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { type FilterState, SalesDynamicsFilter } from './SalesDynamicsFilter';

vi.mock('@/hooks/useAdminCategories', () => ({
  useAdminCategories: vi.fn(() => ({
    categories: [
      { id: 'cat-1', title: 'Electronics' },
      { id: 'cat-2', title: 'Furniture' },
    ],
    loading: false,
  })),
}));

vi.mock('@/hooks/useAdminProduct', () => ({
  useAdminProducts: vi.fn((params: { filters?: { categories?: string[] } }) => {
    if (params?.filters?.categories?.[0] === 'cat-1') {
      return {
        items: [{ id: 'prod-1', title: 'Smartphone X' }],
        loading: false,
      };
    }
    return { items: [], loading: false };
  }),
}));

vi.mock('lucide-react', () => ({
  Calendar: () => <svg data-testid="icon-calendar" />,
  Check: () => <svg data-testid="icon-check" />,
  ChevronDown: () => <svg data-testid="icon-chevron" />,
  RotateCcw: () => <svg data-testid="icon-rotate" />,
}));

describe('SalesDynamicsFilter', () => {
  const mockOnClose = vi.fn();
  const mockOnApply = vi.fn();

  const defaultInitial: FilterState = {
    dateFrom: '2026-04-01',
    dateTo: '2026-04-28',
    categoryId: '',
    productId: '',
    productName: '',
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('не рендериться, якщо isOpen === false', () => {
    const { container } = render(
      <SalesDynamicsFilter
        isOpen={false}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );
    expect(container).toBeEmptyDOMElement();
  });

  it('рендериться коректно, якщо isOpen === true', () => {
    render(
      <SalesDynamicsFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    expect(screen.getByText('Date range')).toBeInTheDocument();

    expect(screen.getAllByText('Category').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Product').length).toBeGreaterThan(0);
  });

  it('блокує вибір товару, якщо не обрана категорія', () => {
    render(
      <SalesDynamicsFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const productSelect = selects[1];

    expect(productSelect).toBeDisabled();
    expect(screen.getByText('Select category first')).toBeInTheDocument();
  });

  it('блокує кнопку Apply, якщо не обраний товар', () => {
    render(
      <SalesDynamicsFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const applyButton = screen.getByRole('button', { name: /Apply/i });
    expect(applyButton).toBeDisabled();
  });

  it('дозволяє обрати категорію, потім товар, і натиснути Apply', async () => {
    const user = userEvent.setup();
    render(
      <SalesDynamicsFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={defaultInitial}
      />,
    );

    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[0];
    const productSelect = selects[1];

    await user.selectOptions(categorySelect, 'cat-1');

    expect(productSelect).not.toBeDisabled();

    await user.selectOptions(productSelect, 'prod-1');

    const applyButton = screen.getByRole('button', { name: /Apply/i });
    expect(applyButton).not.toBeDisabled();

    await user.click(applyButton);

    expect(mockOnApply).toHaveBeenCalledTimes(1);
    expect(mockOnApply).toHaveBeenCalledWith({
      dateFrom: '2026-04-01',
      dateTo: '2026-04-28',
      categoryId: 'cat-1',
      productId: 'prod-1',
      productName: 'Smartphone X',
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('скидає всі поля при натисканні на Reset all', async () => {
    const user = userEvent.setup();

    render(
      <SalesDynamicsFilter
        isOpen={true}
        onClose={mockOnClose}
        onApply={mockOnApply}
        initial={{
          ...defaultInitial,
          categoryId: 'cat-2',
          productId: 'prod-99',
          productName: 'Old Product',
        }}
      />,
    );

    const applyButton = screen.getByRole('button', { name: /Apply/i });
    expect(applyButton).not.toBeDisabled();

    const resetButton = screen.getByRole('button', { name: /Reset all/i });
    await user.click(resetButton);

    expect(applyButton).toBeDisabled();
    expect(screen.getByText('Select category first')).toBeInTheDocument();
  });

  it('закриває модалку при кліку на бекдроп', () => {
    const { container } = render(
      <SalesDynamicsFilter
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
  });
});
