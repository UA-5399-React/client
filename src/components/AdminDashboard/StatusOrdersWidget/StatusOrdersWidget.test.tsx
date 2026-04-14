import type * as ReactRouter from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useOrdersStatusStats } from '@/hooks/useOrdersStatusStats';
import { render, screen } from '@/utils/test-utils';

import { StatusOrdersWidget } from './StatusOrdersWidget';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof ReactRouter>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@/hooks/useOrdersStatusStats', () => ({
  useOrdersStatusStats: vi.fn(),
}));

vi.mock('./StatusOrdersChart', () => ({
  StatusOrdersChart: vi.fn(() => <div data-testid="mock-chart" />),
}));

vi.mock('./StatusOrdersLegend', () => ({
  StatusOrdersLegend: vi.fn(() => <div data-testid="mock-legend" />),
}));

describe('UI Component: StatusOrdersWidget', () => {
  const mockData = {
    total: 100,
    largestSegment: { status: 'completed', count: 60, percentage: 60 },
    statuses: [
      { status: 'completed', count: 60, percentage: 60 },
      { status: 'new', count: 40, percentage: 40 },
    ],
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the skeleton loader when isLoading is true', () => {
    vi.mocked(useOrdersStatusStats).mockReturnValue({
      isLoading: true,
      data: undefined,
      error: null,
    } as unknown as ReturnType<typeof useOrdersStatusStats>);

    const { container } = render(<StatusOrdersWidget />);
    const skeletonContainer = container.querySelector('.animate-pulse');
    expect(skeletonContainer).toBeInTheDocument();

    expect(screen.queryByTestId('mock-chart')).not.toBeInTheDocument();
  });

  it('should render an error message when there is an error', () => {
    vi.mocked(useOrdersStatusStats).mockReturnValue({
      isLoading: false,
      data: undefined,
      error: new Error('Failed to fetch'),
    } as unknown as ReturnType<typeof useOrdersStatusStats>);

    render(<StatusOrdersWidget />);

    expect(screen.getByText('Error loading data')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-chart')).not.toBeInTheDocument();
  });

  it('should render an error message when data is missing (even without explicit error)', () => {
    vi.mocked(useOrdersStatusStats).mockReturnValue({
      isLoading: false,
      data: null,
      error: null,
    } as unknown as ReturnType<typeof useOrdersStatusStats>);

    render(<StatusOrdersWidget />);

    expect(screen.getByText('Error loading data')).toBeInTheDocument();
  });

  it('should render the chart, legend, and button when data is successfully loaded', () => {
    vi.mocked(useOrdersStatusStats).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    } as unknown as ReturnType<typeof useOrdersStatusStats>);

    render(<StatusOrdersWidget />);

    expect(screen.getByTestId('mock-chart')).toBeInTheDocument();
    expect(screen.getByTestId('mock-legend')).toBeInTheDocument();

    expect(
      screen.getByRole('button', { name: /show all/i }),
    ).toBeInTheDocument();
  });

  it('should navigate to the orders page when the "Show all" button is clicked', async () => {
    const user = userEvent.setup();

    vi.mocked(useOrdersStatusStats).mockReturnValue({
      isLoading: false,
      data: mockData,
      error: null,
    } as unknown as ReturnType<typeof useOrdersStatusStats>);

    render(<StatusOrdersWidget />);

    const button = screen.getByRole('button', { name: /show all/i });
    await user.click(button);

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith('/admin/orders');
  });
});
