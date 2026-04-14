import { fireEvent } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { ImportProductsModal } from './ImportProductsModal';

// ── controllable mock state ──────────────────────────────────────────────────
const mockOnClose = vi.fn();
const mockImportProducts = vi.fn();
const mockReset = vi.fn();
const mockValidateFile = vi.fn();

const hookState: {
  loading: boolean;
  error: string | null;
  result: {
    imported: number;
    failed: { row: number; reason: string }[];
  } | null;
} = {
  loading: false,
  error: null,
  result: null,
};

vi.mock('@/hooks/useImportProducts', () => ({
  useImportProducts: () => ({
    importProducts: mockImportProducts,
    loading: hookState.loading,
    error: hookState.error,
    result: hookState.result,
    reset: mockReset,
    validateFile: mockValidateFile,
  }),
}));

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();
  return { ...actual, useApolloClient: () => ({ refetchQueries: vi.fn() }) };
});

// ── helpers ──────────────────────────────────────────────────────────────────
const resetHookState = () => {
  hookState.loading = false;
  hookState.error = null;
  hookState.result = null;
};

// ── tests ────────────────────────────────────────────────────────────────────
describe('UI Component: ImportProductsModal — idle state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState();
    mockValidateFile.mockReturnValue(null);
    mockImportProducts.mockResolvedValue(undefined);
  });

  it('renders the drop zone', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(
      screen.getByRole('button', { name: /file upload area/i }),
    ).toBeInTheDocument();
    expect(screen.getByText(/drag & drop your file here/i)).toBeInTheDocument();
  });

  it('renders the modal title', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByText('Import Products')).toBeInTheDocument();
  });

  it('shows accepted formats hint', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByText(/accepted:/i)).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportProductsModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: /cancel/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the X button is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportProductsModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('button', { name: /close modal/i }));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when the backdrop is clicked', async () => {
    const user = userEvent.setup();
    render(<ImportProductsModal onClose={mockOnClose} />);
    await user.click(screen.getByRole('dialog'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('shows a validation error when an invalid file type is selected', () => {
    mockValidateFile.mockReturnValue('Only .xlsx, .csv files are accepted');
    render(<ImportProductsModal onClose={mockOnClose} />);

    const file = new File(['content'], 'products.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/file input/i);
    fireEvent.change(input, { target: { files: [file] } });

    expect(
      screen.getByText(/only .xlsx, .csv files are accepted/i),
    ).toBeInTheDocument();
    expect(mockImportProducts).not.toHaveBeenCalled();
  });

  it('calls importProducts with the selected file when validation passes', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);

    const file = new File(['a,b'], 'products.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/file input/i);
    fireEvent.change(input, { target: { files: [file] } });

    expect(mockImportProducts).toHaveBeenCalledWith(file);
  });
});

describe('UI Component: ImportProductsModal — loading state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState();
    hookState.loading = true;
  });

  it('shows loading spinner text', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByText(/importing/i)).toBeInTheDocument();
  });

  it('hides the footer buttons while loading', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(
      screen.queryByRole('button', { name: /cancel/i }),
    ).not.toBeInTheDocument();
  });
});

describe('UI Component: ImportProductsModal — result state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState();
    mockReset.mockImplementation(() => resetHookState());
  });

  it('shows success message when all rows imported', () => {
    hookState.result = { imported: 5, failed: [] };
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(
      screen.getByText(/5 products imported successfully/i),
    ).toBeInTheDocument();
  });

  it('uses singular "product" when 1 item imported', () => {
    hookState.result = { imported: 1, failed: [] };
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(
      screen.getByText(/1 product imported successfully/i),
    ).toBeInTheDocument();
  });

  it('shows failed rows when partial import', () => {
    hookState.result = {
      imported: 2,
      failed: [
        { row: 3, reason: 'Missing required field: title' },
        { row: 5, reason: 'Invalid status "published"' },
      ],
    };
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByText(/2 rows had errors/i)).toBeInTheDocument();
    expect(screen.getByText(/row 3/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Missing required field: title/i),
    ).toBeInTheDocument();
  });

  it('shows Done button instead of Cancel in result state', () => {
    hookState.result = { imported: 3, failed: [] };
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByRole('button', { name: /done/i })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /^cancel$/i }),
    ).not.toBeInTheDocument();
  });

  it('calls reset when "Import another file" is clicked', async () => {
    hookState.result = { imported: 1, failed: [] };
    const user = userEvent.setup();
    render(<ImportProductsModal onClose={mockOnClose} />);
    await user.click(
      screen.getByRole('button', { name: /import another file/i }),
    );
    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});

describe('UI Component: ImportProductsModal — error state', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    resetHookState();
    hookState.error = 'Network failure';
  });

  it('shows the error alert', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('displays the error message', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(screen.getByText(/network failure/i)).toBeInTheDocument();
  });

  it('shows "Import another file" button to retry', () => {
    render(<ImportProductsModal onClose={mockOnClose} />);
    expect(
      screen.getByRole('button', { name: /import another file/i }),
    ).toBeInTheDocument();
  });
});
