import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { exportService } from '@/services/exportService';
import { useErrorStore } from '@/store/errorStore';

import { DownloadOrderButton } from './DownloadOrderButton';

vi.mock('@/services/exportService', () => ({
  exportService: {
    exportOrderPDF: vi.fn(),
  },
}));

vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn(),
}));

const mockedExportOrderPDF = vi.mocked(exportService.exportOrderPDF);
const mockedUseErrorStore = vi.mocked(useErrorStore) as unknown as Mock;

describe('DownloadOrderButton', () => {
  const mockOrderId = '12345';
  const mockShowFn = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    mockedUseErrorStore.mockReturnValue(mockShowFn);

    window.URL.createObjectURL = vi.fn(() => 'blob:url');
    window.URL.revokeObjectURL = vi.fn();

    HTMLAnchorElement.prototype.click = vi.fn();
  });

  it('renders the button with correct initial text', () => {
    render(<DownloadOrderButton orderId={mockOrderId} />);
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('calls export service and shows success toast on successful download', async () => {
    const mockBlob = new Blob(['pdf-content'], { type: 'application/pdf' });
    mockedExportOrderPDF.mockResolvedValueOnce(mockBlob);

    render(<DownloadOrderButton orderId={mockOrderId} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(mockedExportOrderPDF).toHaveBeenCalledWith(mockOrderId);
      expect(mockShowFn).toHaveBeenCalledWith(
        'success',
        'Export Successful',
        'PDF downloaded successfully',
      );
    });

    expect(button).not.toBeDisabled();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('shows error message when the export service fails', async () => {
    mockedExportOrderPDF.mockRejectedValueOnce(new Error('API Error'));

    render(<DownloadOrderButton orderId={mockOrderId} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(mockShowFn).toHaveBeenCalledWith(
        'error',
        'Export Failed',
        'API Error',
      );
    });

    expect(screen.getByText('Download PDF')).toBeInTheDocument();
    expect(screen.queryByText('Exporting...')).not.toBeInTheDocument();
  });

  it('cleans up temporary DOM elements and URLs', async () => {
    const mockBlob = new Blob(['pdf-content'], { type: 'application/pdf' });
    mockedExportOrderPDF.mockResolvedValueOnce(mockBlob);

    render(<DownloadOrderButton orderId={mockOrderId} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(window.URL.createObjectURL).toHaveBeenCalled();
      expect(window.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });
});
