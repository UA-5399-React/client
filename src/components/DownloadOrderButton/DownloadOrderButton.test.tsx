import { toast } from 'react-hot-toast';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { exportService } from '@/services/exportService';

import { DownloadOrderButton } from './DownloadOrderButton';

vi.mock('@/services/exportService', () => ({
  exportService: {
    exportOrderPDF: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockedExportOrderPDF = vi.mocked(exportService.exportOrderPDF);

describe('DownloadOrderButton', () => {
  const mockOrderId = '12345';

  beforeEach(() => {
    vi.clearAllMocks();

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
      expect(toast.success).toHaveBeenCalledWith('PDF downloaded successfully');
    });

    expect(button).not.toBeDisabled();
    expect(screen.getByText('Download PDF')).toBeInTheDocument();
  });

  it('shows error toast when the export service fails', async () => {
    mockedExportOrderPDF.mockRejectedValueOnce(new Error('API Error'));

    render(<DownloadOrderButton orderId={mockOrderId} />);

    fireEvent.click(screen.getByRole('button'));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Failed to download PDF');
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
