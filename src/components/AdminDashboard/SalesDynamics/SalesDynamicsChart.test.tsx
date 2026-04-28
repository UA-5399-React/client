import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { SalesDynamicsPoint } from '@/hooks/useSalesDynamics';

import { SalesDynamicsChart } from './SalesDynamicsChart';

vi.mock('react-chartjs-2', () => ({
  Line: ({ data }: { data: Record<string, unknown> }) => (
    <div data-testid="mock-line-chart" data-chart-data={JSON.stringify(data)} />
  ),
}));

describe('SalesDynamicsChart', () => {
  const mockPoints: SalesDynamicsPoint[] = [
    { date: '2026-04-01', value: 10, productId: 'prod-1' },
    { date: '2026-04-02', value: 15, productId: 'prod-1' },
    { date: '2026-04-01', value: 5, productId: 'prod-2' },
  ];

  const mockProductLabels = {
    'prod-1': 'Fresh Wooden Salad',
    'prod-2': 'Gorgeous Concrete Fish',
  };

  it('показує стан завантаження, коли loading === true', () => {
    render(
      <SalesDynamicsChart
        points={[]}
        productIds={[]}
        productLabels={{}}
        loading={true}
      />,
    );

    expect(screen.getByText('Loading chart data...')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
  });

  it('показує пустий стан, коли немає обраних товарів (productIds пустий)', () => {
    render(
      <SalesDynamicsChart
        points={mockPoints}
        productIds={[]}
        productLabels={{}}
        loading={false}
      />,
    );

    expect(
      screen.getByText('Select a product to see sales dynamics'),
    ).toBeInTheDocument();
    expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
  });

  it('рендерить графік з правильними даними для одного товару', () => {
    render(
      <SalesDynamicsChart
        points={mockPoints}
        productIds={['prod-1']}
        productLabels={mockProductLabels}
        loading={false}
      />,
    );

    const chartMock = screen.getByTestId('mock-line-chart');
    expect(chartMock).toBeInTheDocument();

    const chartData = JSON.parse(
      chartMock.getAttribute('data-chart-data') || '{}',
    );

    expect(chartData.labels).toEqual(['2026-04-01', '2026-04-02']);

    expect(chartData.datasets).toHaveLength(1);
    expect(chartData.datasets[0].label).toBe('Fresh Wooden Salad');
    expect(chartData.datasets[0].data).toEqual([10, 15]);
    expect(chartData.datasets[0].fill).toBe(true);
  });

  it('рендерить графік для порівняння двох товарів і обробляє нульові значення', () => {
    render(
      <SalesDynamicsChart
        points={mockPoints}
        productIds={['prod-1', 'prod-2']}
        productLabels={mockProductLabels}
        loading={false}
      />,
    );

    const chartMock = screen.getByTestId('mock-line-chart');
    const chartData = JSON.parse(
      chartMock.getAttribute('data-chart-data') || '{}',
    );

    expect(chartData.datasets).toHaveLength(2);

    const secondDataset = chartData.datasets[1];
    expect(secondDataset.label).toBe('Gorgeous Concrete Fish');

    expect(secondDataset.data).toEqual([5, 0]);

    expect(secondDataset.fill).toBe(false);
  });
});
