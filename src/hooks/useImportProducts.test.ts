import * as ApolloReact from '@apollo/client/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET_PRODUCTS_PAGE } from '@/services/graphql/productAdminService';
import { productsImportService } from '@/services/productsImportService';

import { useImportProducts } from './useImportProducts';

vi.mock('@apollo/client/react', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useApolloClient: vi.fn(),
  };
});

vi.mock('@/services/productsImportService', () => ({
  productsImportService: {
    importProducts: vi.fn(),
  },
}));

describe('useImportProducts', () => {
  const refetchQueries = vi.fn().mockResolvedValue(undefined);

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ApolloReact.useApolloClient).mockReturnValue({
      refetchQueries,
    } as unknown as ReturnType<typeof ApolloReact.useApolloClient>);
  });

  it('validateFile rejects unsupported extensions', () => {
    const { result } = renderHook(() => useImportProducts());

    expect(result.current.validateFile(new File([], 'a.pdf'))).toBe(
      'Only .xlsx, .csv files are accepted',
    );
  });

  it('validateFile rejects files larger than 10 MB', () => {
    const { result } = renderHook(() => useImportProducts());
    const large = new File([new ArrayBuffer(10 * 1024 * 1024 + 1)], 'big.csv');

    expect(result.current.validateFile(large)).toBe(
      'File must be smaller than 10 MB',
    );
  });

  it('validateFile accepts xlsx and csv', () => {
    const { result } = renderHook(() => useImportProducts());

    expect(result.current.validateFile(new File([], 'a.csv'))).toBeNull();
    expect(result.current.validateFile(new File([], 'b.XLSX'))).toBeNull();
  });

  it('importProducts sets validation error and skips request for invalid file', async () => {
    const { result } = renderHook(() => useImportProducts());

    await act(async () => {
      await result.current.importProducts(new File([], 'bad.pdf'));
    });

    expect(result.current.error).toBe('Only .xlsx, .csv files are accepted');
    expect(productsImportService.importProducts).not.toHaveBeenCalled();
    expect(refetchQueries).not.toHaveBeenCalled();
  });

  it('importProducts stores result and refetches products page on success', async () => {
    const payload = {
      imported: 2,
      failed: [] as { row: number; reason: string }[],
    };
    vi.mocked(productsImportService.importProducts).mockResolvedValue(payload);

    const { result } = renderHook(() => useImportProducts());

    await act(async () => {
      await result.current.importProducts(new File([], 'stock.csv'));
    });

    expect(productsImportService.importProducts).toHaveBeenCalledTimes(1);
    expect(refetchQueries).toHaveBeenCalledWith({
      include: [GET_PRODUCTS_PAGE],
    });
    expect(result.current.result).toEqual(payload);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('importProducts sets error from thrown Error', async () => {
    vi.mocked(productsImportService.importProducts).mockRejectedValue(
      new Error('Bad rows'),
    );

    const { result } = renderHook(() => useImportProducts());

    await act(async () => {
      await result.current.importProducts(new File([], 'bad.csv'));
    });

    expect(result.current.error).toBe('Bad rows');
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('importProducts sets generic error for non-Error throws', async () => {
    vi.mocked(productsImportService.importProducts).mockRejectedValue('oops');

    const { result } = renderHook(() => useImportProducts());

    await act(async () => {
      await result.current.importProducts(new File([], 'bad.csv'));
    });

    expect(result.current.error).toBe('Unexpected error during import');
  });

  it('sets loading true while import is in flight', async () => {
    const payload = { imported: 0, failed: [] };
    let resolveImport!: (value: typeof payload) => void;
    const deferred = new Promise<typeof payload>((r) => {
      resolveImport = r;
    });

    vi.mocked(productsImportService.importProducts).mockReturnValue(deferred);

    const { result } = renderHook(() => useImportProducts());

    act(() => {
      void result.current.importProducts(new File([], 'wait.csv'));
    });

    await waitFor(() => expect(result.current.loading).toBe(true));

    await act(async () => {
      resolveImport(payload);
      await deferred;
    });

    expect(result.current.loading).toBe(false);
  });

  it('reset clears loading, error, and result', async () => {
    vi.mocked(productsImportService.importProducts).mockRejectedValue(
      new Error('x'),
    );

    const { result } = renderHook(() => useImportProducts());

    await act(async () => {
      await result.current.importProducts(new File([], 'a.csv'));
    });

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });
});
