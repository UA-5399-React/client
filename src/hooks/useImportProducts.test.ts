import * as ApolloClient from '@apollo/client/react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET_PRODUCTS_PAGE } from '@/services/graphql/productAdminService';
import { productsImportService } from '@/services/productsImportService';
import type { ImportResult } from '@/types/import.types';

import { useImportProducts } from './useImportProducts';

vi.mock('@apollo/client/react', () => ({
  useApolloClient: vi.fn(),
}));

vi.mock('@/services/productsImportService', () => ({
  productsImportService: {
    importProducts: vi.fn(),
  },
}));

describe('Hook: useImportProducts', () => {
  const mockRefetchQueries = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(ApolloClient.useApolloClient).mockReturnValue({
      refetchQueries: mockRefetchQueries,
    } as unknown as ReturnType<typeof ApolloClient.useApolloClient>);
  });

  it('validates file extension and size', () => {
    const { result } = renderHook(() => useImportProducts());

    const invalidExt = new File(['id,title'], 'products.txt', {
      type: 'text/plain',
    });
    const tooLarge = new File(['x'], 'products.csv', { type: 'text/csv' });
    Object.defineProperty(tooLarge, 'size', { value: 11 * 1024 * 1024 });

    expect(result.current.validateFile(invalidExt)).toBe(
      'Only .xlsx, .csv files are accepted',
    );
    expect(result.current.validateFile(tooLarge)).toBe(
      'File must be smaller than 10 MB',
    );
  });

  it('sets validation error and skips import call for invalid file', async () => {
    const { result } = renderHook(() => useImportProducts());
    const invalidFile = new File(['x'], 'bad.pdf', {
      type: 'application/pdf',
    });

    await act(async () => {
      await result.current.importProducts(invalidFile);
    });

    expect(productsImportService.importProducts).not.toHaveBeenCalled();
    expect(result.current.error).toBe('Only .xlsx, .csv files are accepted');
    expect(result.current.loading).toBe(false);
  });

  it('imports products successfully and refetches products query', async () => {
    const response: ImportResult = {
      imported: 2,
      failed: [],
    };

    vi.mocked(productsImportService.importProducts).mockResolvedValue(response);
    mockRefetchQueries.mockResolvedValue(undefined);

    const { result } = renderHook(() => useImportProducts());
    const validFile = new File(['id,title'], 'products.csv', {
      type: 'text/csv',
    });

    await act(async () => {
      await result.current.importProducts(validFile);
    });

    expect(productsImportService.importProducts).toHaveBeenCalledWith(
      validFile,
    );
    expect(mockRefetchQueries).toHaveBeenCalledWith({
      include: [GET_PRODUCTS_PAGE],
    });
    expect(result.current.result).toEqual(response);
    expect(result.current.error).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('sets error from thrown Error message', async () => {
    vi.mocked(productsImportService.importProducts).mockRejectedValue(
      new Error('Import failed'),
    );

    const { result } = renderHook(() => useImportProducts());
    const validFile = new File(['id,title'], 'products.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    await act(async () => {
      await result.current.importProducts(validFile);
    });

    expect(result.current.error).toBe('Import failed');
    expect(result.current.result).toBeNull();
    expect(result.current.loading).toBe(false);
  });

  it('resets state after import attempt', async () => {
    const response: ImportResult = {
      imported: 1,
      failed: [],
    };

    vi.mocked(productsImportService.importProducts).mockResolvedValue(response);
    mockRefetchQueries.mockResolvedValue(undefined);

    const { result } = renderHook(() => useImportProducts());
    const validFile = new File(['id,title'], 'products.csv', {
      type: 'text/csv',
    });

    await act(async () => {
      await result.current.importProducts(validFile);
    });

    await waitFor(() => expect(result.current.result).toEqual(response));

    act(() => {
      result.current.reset();
    });

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.result).toBeNull();
  });
});
