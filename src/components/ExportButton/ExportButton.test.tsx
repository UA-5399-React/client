import { toast } from 'react-hot-toast';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { exportService } from '../../services/exportService';
import { ExportButton } from './ExportButton';

vi.mock('../../services/exportService', () => ({
  exportService: {
    exportProducts: vi.fn(),
    exportOrders: vi.fn(),
  },
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

window.URL.createObjectURL = vi.fn(() => 'mock-url');
window.URL.revokeObjectURL = vi.fn();

describe('ExportButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly with products type', () => {
    render(<ExportButton type="products" />);
    expect(screen.getByText('Export Products')).toBeInTheDocument();
  });

  it('renders correctly with orders type', () => {
    render(<ExportButton type="orders" />);
    expect(screen.getByText('Export Orders')).toBeInTheDocument();
  });

  it('calls exportProducts and shows success toast on click', async () => {
    const mockBlob = new Blob(['test data'], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    vi.mocked(exportService.exportProducts).mockResolvedValue(mockBlob);

    render(<ExportButton type="products" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    expect(screen.getByText('Exporting...')).toBeInTheDocument();
    expect(button).toBeDisabled();

    await waitFor(() => {
      expect(exportService.exportProducts).toHaveBeenCalledTimes(1);
      expect(toast.success).toHaveBeenCalledWith(
        'Exported products successfully',
      );
    });

    expect(button).not.toBeDisabled();
  });

  it('shows error toast when export fails', async () => {
    vi.mocked(exportService.exportOrders).mockRejectedValue(
      new Error('Network Error'),
    );

    render(<ExportButton type="orders" />);
    const button = screen.getByRole('button');

    fireEvent.click(button);

    await waitFor(() => {
      expect(exportService.exportOrders).toHaveBeenCalledTimes(1);
      expect(toast.error).toHaveBeenCalledWith('Failed to export orders');
    });
  });
});
