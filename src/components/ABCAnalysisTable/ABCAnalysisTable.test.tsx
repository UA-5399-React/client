import { describe, expect, it, vi } from 'vitest';

import { useAbcAnalysis } from '@/hooks/useAbcAnalysis';
import { fireEvent, render, screen, userEvent } from '@/utils/test-utils';

import { ABCAnalysisTable } from './ABCAnalysisTable';

vi.mock('@/hooks/useAbcAnalysis', () => ({
  useAbcAnalysis: vi.fn(),
}));

const mockUseAbcAnalysis = vi.mocked(useAbcAnalysis);

describe('UI Component: ABCAnalysisTable', () => {
  it('should render abc table data and summary from hook', () => {
    mockUseAbcAnalysis.mockReturnValue({
      items: [
        {
          productName: 'Gorgeous Marble Salad',
          productCode: 'P-1001',
          value: 1200.5,
          cumulativeValue: 1200.5,
          totalValue: 1200.5,
          cumulativePercentage: 33.3,
          percentageByTotal: 33.3,
          bucket: 'C',
        },
      ],
      summary: {
        aCount: 1,
        bCount: 1,
        cCount: 1,
        metric: 'REVENUE',
        totalValue: 1200.5,
      },
      total: 1,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    render(<ABCAnalysisTable />);

    expect(
      screen.getByRole('columnheader', { name: 'Code Product' }),
    ).toBeInTheDocument();
    expect(screen.getByText('P-1001')).toBeInTheDocument();
    expect(screen.getByText('Gorgeous Marble Salad')).toBeInTheDocument();
    expect(screen.getByText('$1200.50')).toBeInTheDocument();
    expect(screen.getByText('33.3%')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
    expect(screen.getByText('Total: 1200.5')).toBeInTheDocument();
  });

  it('should toggle metric and request UNITS on switch click', async () => {
    const user = userEvent.setup();

    mockUseAbcAnalysis.mockReturnValue({
      items: [
        {
          productName: 'Widget',
          productCode: 'P-2002',
          value: 10,
          cumulativeValue: 10,
          totalValue: 10,
          cumulativePercentage: 10,
          percentageByTotal: 10,
          bucket: 'A',
        },
      ],
      summary: null,
      total: 1,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    render(<ABCAnalysisTable />);

    expect(
      screen.getByRole('columnheader', { name: 'Revenue' }),
    ).toBeInTheDocument();
    expect(screen.getByText('$10.00')).toBeInTheDocument();

    await user.click(
      screen.getByRole('switch', {
        name: 'Toggle between quantity and revenue',
      }),
    );

    expect(
      screen.getByRole('columnheader', { name: 'Quantity' }),
    ).toBeInTheDocument();
    expect(screen.getByText('10 pcs')).toBeInTheDocument();
    expect(mockUseAbcAnalysis).toHaveBeenLastCalledWith(
      expect.objectContaining({
        metric: 'UNITS',
      }),
    );
  });

  it('should clamp thresholds before requesting data', () => {
    mockUseAbcAnalysis.mockReturnValue({
      items: [],
      summary: null,
      total: 1,
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    });

    render(<ABCAnalysisTable />);

    fireEvent.change(screen.getByLabelText('Red threshold'), {
      target: { value: '40' },
    });
    fireEvent.change(screen.getByLabelText('Green threshold'), {
      target: { value: '60' },
    });

    expect(mockUseAbcAnalysis).toHaveBeenLastCalledWith(
      expect.objectContaining({
        aThreshold: 20,
        bThreshold: 80,
      }),
    );
  });
});
