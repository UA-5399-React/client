import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GroupBy } from '@/hooks/useSalesDynamics';

import { SalesDynamicsWidget } from './SalesDynamicsWidget';

const mockUseSalesDynamics = vi.fn();
vi.mock('@/hooks/useSalesDynamics', () => ({
  useSalesDynamics: (queryVars: unknown) => mockUseSalesDynamics(queryVars),
  GroupBy: { DAY: 'DAY', WEEK: 'WEEK', MONTH: 'MONTH' },
}));

vi.mock('./SalesDynamicsChart', () => ({
  SalesDynamicsChart: ({ productIds }: { productIds: string[] }) => (
    <div data-testid="mock-chart">
      Chart rendered with: {productIds.join(', ')}
    </div>
  ),
}));

vi.mock('./SalesDynamicsFilter', () => ({
  SalesDynamicsFilter: ({
    isOpen,
    onApply,
    isCompareMode,
  }: {
    isOpen: boolean;
    onApply: (data: unknown) => void;
    isCompareMode?: boolean;
  }) => {
    if (!isOpen) return null;
    return (
      <div data-testid={`mock-filter-${isCompareMode ? 'compare' : 'main'}`}>
        <button
          data-testid={`apply-filter-${isCompareMode ? 'compare' : 'main'}`}
          onClick={() =>
            onApply({
              dateFrom: '2026-01-01',
              dateTo: '2026-01-31',
              categoryId: 'cat-1',
              productId: isCompareMode ? 'prod-2' : 'prod-1',
              productName: isCompareMode
                ? 'Gorgeous Concrete Fish'
                : 'Fresh Wooden Salad',
            })
          }
        >
          Apply Mock Filter
        </button>
      </div>
    );
  },
}));

describe('SalesDynamicsWidget', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseSalesDynamics.mockReturnValue({ data: null, loading: false });
  });

  it('рендерить початковий (пустий) стан віджета', () => {
    render(<SalesDynamicsWidget />);

    expect(
      screen.getByRole('button', { name: /Select Product/i }),
    ).toBeInTheDocument();
    expect(screen.queryByTitle('Clear entire chart')).not.toBeInTheDocument();
    expect(screen.queryByText(/Add compare product/i)).not.toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toHaveTextContent(
      'Chart rendered with:',
    );
    expect(mockUseSalesDynamics).toHaveBeenCalledWith(null);
  });

  it('дозволяє обрати основний товар та оновлює стан віджета', async () => {
    const user = userEvent.setup();
    render(<SalesDynamicsWidget />);

    await user.click(screen.getByRole('button', { name: /Select Product/i }));
    expect(screen.getByTestId('mock-filter-main')).toBeInTheDocument();

    await user.click(screen.getByTestId('apply-filter-main'));

    expect(screen.getByText('Fresh Wooden Salad')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Change Product/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/Add compare product/i)).toBeInTheDocument();
    expect(screen.getByTitle('Clear entire chart')).toBeInTheDocument();

    expect(screen.getByTestId('mock-chart')).toHaveTextContent(
      'Chart rendered with: prod-1',
    );
    expect(mockUseSalesDynamics).toHaveBeenCalledWith(
      expect.objectContaining({
        productIds: ['prod-1'],
        groupBy: GroupBy.MONTH,
      }),
    );
  });

  it('дозволяє додати товар для порівняння', async () => {
    const user = userEvent.setup();
    render(<SalesDynamicsWidget />);

    await user.click(screen.getByRole('button', { name: /Select Product/i }));
    await user.click(screen.getByTestId('apply-filter-main'));

    await user.click(screen.getByText(/Add compare product/i));
    expect(screen.getByTestId('mock-filter-compare')).toBeInTheDocument();

    await user.click(screen.getByTestId('apply-filter-compare'));

    expect(screen.getByText('VS')).toBeInTheDocument();
    expect(screen.getByText('Gorgeous Concrete Fish')).toBeInTheDocument();

    expect(screen.getByTestId('mock-chart')).toHaveTextContent(
      'Chart rendered with: prod-1, prod-2',
    );
  });

  it('кнопка "Clear chart" скидає віджет до початкового стану', async () => {
    const user = userEvent.setup();
    render(<SalesDynamicsWidget />);

    await user.click(screen.getByRole('button', { name: /Select Product/i }));
    await user.click(screen.getByTestId('apply-filter-main'));

    expect(screen.getByText('Fresh Wooden Salad')).toBeInTheDocument();

    await user.click(screen.getByTitle('Clear entire chart'));

    expect(screen.queryByText('Fresh Wooden Salad')).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Select Product/i }),
    ).toBeInTheDocument();
    expect(screen.getByTestId('mock-chart')).toHaveTextContent(
      'Chart rendered with:',
    );
  });

  it('змінює угруповання (GroupBy) при натисканні на кнопки (Day/Week/Month)', async () => {
    const user = userEvent.setup();
    render(<SalesDynamicsWidget />);

    await user.click(screen.getByRole('button', { name: /Select Product/i }));
    await user.click(screen.getByTestId('apply-filter-main'));

    expect(mockUseSalesDynamics).toHaveBeenCalledWith(
      expect.objectContaining({ groupBy: GroupBy.MONTH }),
    );

    await user.click(screen.getByRole('button', { name: /Week/i }));

    expect(mockUseSalesDynamics).toHaveBeenCalledWith(
      expect.objectContaining({ groupBy: GroupBy.WEEK }),
    );
  });
});
