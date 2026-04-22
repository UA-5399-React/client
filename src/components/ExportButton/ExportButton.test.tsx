import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { EXPORT_TYPES } from '@/constants';
import { exportService } from '@/services/exportService';
import { useErrorStore } from '@/store/errorStore';

import { ExportButton } from './ExportButton';

vi.mock('@/services/exportService', () => ({
  exportService: {
    exportProducts: vi.fn(),
    exportOrders: vi.fn(),
  },
}));

vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn(),
}));

const mockedUseErrorStore = vi.mocked(useErrorStore) as unknown as Mock;

window.URL.createObjectURL = vi.fn(() => 'mock-url');
window.URL.revokeObjectURL = vi.fn();

describe('ExportButton', () => {
  const mockShowFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseErrorStore.mockReturnValue(mockShowFn);

    HTMLAnchorElement.prototype.click = vi.fn();
  });

  it('renders correctly with products type', () => {
    render(<ExportButton type={EXPORT_TYPES.PRODUCTS} />);
    expect(screen.getByText('Export Products')).toBeInTheDocument();
  });

  it('renders correctly with orders type', () => {
    render(<ExportButton type={EXPORT_TYPES.ORDERS} />);
    expect(screen.getByText('Export Orders')).toBeInTheDocument();
  });

  it('calls exportProducts and shows success toast on click', async () => {
    const mockBlob = new Blob(['test data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    vi.mocked(exportService.exportProducts).mockResolvedValue(mockBlob);

    render(<ExportButton type={EXPORT_TYPES.PRODUCTS} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(exportService.exportProducts).toHaveBeenCalledTimes(1);
      expect(mockShowFn).toHaveBeenCalledWith(
        'success',
        'Export Successful',
        'Products exported successfully',
      );
    });

    expect(button).not.toBeDisabled();
  });

  it('shows error toast when export fails', async () => {
    vi.mocked(exportService.exportOrders).mockRejectedValue(
      new Error('Network Error'),
    );

    render(<ExportButton type={EXPORT_TYPES.ORDERS} />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(exportService.exportOrders).toHaveBeenCalledTimes(1);
      expect(mockShowFn).toHaveBeenCalledWith(
        'error',
        'Export Failed',
        'Failed to export orders. Please try again.',
      );
    });
  });
});
