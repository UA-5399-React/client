import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useAbcAnalysis } from '@/hooks/useAbcAnalysis';
import type { AbcAnalysisItem } from '@/types/statistic.types';
import {
  fireEvent,
  render,
  screen,
  userEvent,
  waitFor,
} from '@/utils/test-utils';

import { ABCAnalysisTable } from './ABCAnalysisTable';

vi.mock('@/hooks/useAbcAnalysis', () => ({
  useAbcAnalysis: vi.fn(),
}));

const mockUseAbcAnalysis = vi.mocked(useAbcAnalysis);

type MockAbcAnalysisReturn = ReturnType<typeof useAbcAnalysis>;

const DASHBOARD_PATH = '/admin/dashboard';

const sampleItem: AbcAnalysisItem = {
  productName: 'Gorgeous Marble Salad',
  productCode: 'P-1001',
  value: 1200.5,
  cumulativeValue: 1200.5,
  totalValue: 1200.5,
  cumulativePercentage: 33.3,
  percentageByTotal: 33.3,
  bucket: 'C',
};

const defaultHookReturn: MockAbcAnalysisReturn = {
  items: [sampleItem],
  summary: {
    aCount: 1,
    bCount: 1,
    cCount: 1,
    metric: 'REVENUE',
    totalValue: 1200.5,
  },
  total: 1,
  totalPages: 1,
  categoryId: null,
  loading: false,
  dateFrom: undefined,
  dateTo: undefined,
  error: undefined,
  refetch: vi.fn(),
};

const mockAbcAnalysis = (overrides: Partial<MockAbcAnalysisReturn> = {}) => {
  mockUseAbcAnalysis.mockReturnValue({
    ...defaultHookReturn,
    ...overrides,
  });
};

const setUrl = (search: string) => {
  window.history.pushState(
    {},
    '',
    search ? `${DASHBOARD_PATH}?${search}` : DASHBOARD_PATH,
  );
};

const getAbcPageFromUrl = () =>
  new URLSearchParams(window.location.search).get('abcPage');

describe('UI Component: ABCAnalysisTable', () => {
  beforeEach(() => {
    setUrl('');
    mockAbcAnalysis();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render abc table data and summary from hook', () => {
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

      mockAbcAnalysis({
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
          } satisfies AbcAnalysisItem,
        ],
        summary: null,
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
      mockAbcAnalysis({ items: [], summary: null });

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

  describe('URL pagination (abcPage)', () => {
    it('should read page from abcPage URL param', () => {
      setUrl('abcPage=2');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      expect(mockUseAbcAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });

    it('should fallback to page 1 when abcPage URL param is invalid', () => {
      setUrl('abcPage=0');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      expect(mockUseAbcAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ page: 1 }),
      );
    });

    it('should update abcPage in URL when user changes pagination', async () => {
      const user = userEvent.setup();
      setUrl('abcPage=1');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      await user.click(screen.getByRole('button', { name: '2' }));

      expect(getAbcPageFromUrl()).toBe('2');
      expect(mockUseAbcAnalysis).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 2 }),
      );
    });

    it('should reset abcPage to 1 when user searches', async () => {
      const user = userEvent.setup();
      setUrl('abcPage=3');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      await user.type(screen.getByPlaceholderText('Search'), 'tv');

      expect(getAbcPageFromUrl()).toBe('1');
    });

    it('should reset abcPage to 1 when user toggles metric', async () => {
      const user = userEvent.setup();
      setUrl('abcPage=2');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      await user.click(
        screen.getByRole('switch', {
          name: 'Toggle between quantity and revenue',
        }),
      );

      expect(getAbcPageFromUrl()).toBe('1');
    });

    it('should reset abcPage to 1 when user changes red threshold', () => {
      setUrl('abcPage=2');
      mockAbcAnalysis({ totalPages: 5, items: [], summary: null });

      render(<ABCAnalysisTable />);

      fireEvent.change(screen.getByLabelText('Red threshold'), {
        target: { value: '15' },
      });

      expect(getAbcPageFromUrl()).toBe('1');
    });

    it('should reset abcPage to 1 when current page is out of range', async () => {
      setUrl('abcPage=100');
      mockAbcAnalysis({ totalPages: 5, items: [], summary: null });

      render(<ABCAnalysisTable />);

      await waitFor(() => {
        expect(getAbcPageFromUrl()).toBe('1');
      });
    });

    it('should not conflict with group table page param', () => {
      setUrl('page=3&abcPage=2');
      mockAbcAnalysis({ totalPages: 5 });

      render(<ABCAnalysisTable />);

      expect(mockUseAbcAnalysis).toHaveBeenCalledWith(
        expect.objectContaining({ page: 2 }),
      );
      expect(getAbcPageFromUrl()).toBe('2');
      expect(new URLSearchParams(window.location.search).get('page')).toBe('3');
    });
  });
});
