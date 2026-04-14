import { Doughnut } from 'react-chartjs-2';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { OrdersStatusStats } from '@/types';
import { render, screen } from '@/utils/test-utils';

import { StatusOrdersChart } from './StatusOrdersChart';

vi.mock('chart.js', () => ({
  Chart: {
    register: vi.fn(),
  },
  ArcElement: vi.fn(),
}));

vi.mock('react-chartjs-2', () => ({
  Doughnut: vi.fn(() => <div data-testid="mock-doughnut" />),
}));

vi.mock('./constants', () => ({
  STATUS_COLORS: {
    completed: '#10b981',
    processing: '#f59e0b',
    cancelled: '#ef4444',
  },
}));

describe('UI Component: StatusOrdersChart', () => {
  const mockData: OrdersStatusStats = {
    total: 250,

    largestSegment: { status: 'completed', count: 150, percentage: 60 },
    statuses: [
      { status: 'completed', count: 150, percentage: 60 },
      { status: 'processing', count: 75, percentage: 30 },
      { status: 'cancelled', count: 25, percentage: 10 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the chart component without crashing', () => {
    render(<StatusOrdersChart data={mockData} />);

    expect(screen.getByTestId('mock-doughnut')).toBeInTheDocument();
  });

  it('should display the correct total number of orders in the center', () => {
    render(<StatusOrdersChart data={mockData} />);

    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('should pass the correctly transformed data to the Doughnut chart', () => {
    render(<StatusOrdersChart data={mockData} />);

    const doughnutCallArgs = vi.mocked(Doughnut).mock.calls[0][0];
    const dataset = doughnutCallArgs.data.datasets[0];

    expect(dataset.data).toEqual([150, 75, 25]);

    expect(dataset.backgroundColor).toEqual(['#10b981', '#f59e0b', '#ef4444']);
    expect(dataset.borderWidth).toBe(0);
    expect(dataset.hoverOffset).toBe(14);
  });

  it('should pass correct layout and plugin options to the Doughnut chart', () => {
    render(<StatusOrdersChart data={mockData} />);

    const doughnutCallArgs = vi.mocked(Doughnut).mock.calls[0][0];
    const { options } = doughnutCallArgs;

    expect(options!.cutout).toBe('75%');
    expect(options!.plugins!.tooltip!.enabled).toBe(false);

    const customPlugins = options!.plugins as unknown as {
      hoverPercentage: Record<string, unknown>;
    };

    expect(customPlugins.hoverPercentage.statuses).toEqual(mockData.statuses);
    expect(customPlugins.hoverPercentage.opacityRef).toBeDefined();
    expect(customPlugins.hoverPercentage.activeIndexRef).toBeDefined();
    expect(customPlugins.hoverPercentage.rafRef).toBeDefined();
  });
});
