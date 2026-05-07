import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { uploadService } from '@/services';

import { useUploadProductImage } from './useUploadProductImage';

vi.mock('@/services', () => ({
  uploadService: {
    uploadProductImage: vi.fn(),
  },
}));

describe('useUploadProductImage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('uploads file, clears error, toggles loading, returns response', async () => {
    const file = new File(['x'], 'p.png', { type: 'image/png' });
    const response = {
      imageUrl: 'https://cdn.example/img.png',
      imagePublicId: 'products/x',
    };

    vi.mocked(uploadService.uploadProductImage).mockResolvedValueOnce(response);

    const { result } = renderHook(() => useUploadProductImage());

    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();

    let returned: typeof response | undefined;
    await act(async () => {
      returned = await result.current.uploadImage(file);
    });

    expect(uploadService.uploadProductImage).toHaveBeenCalledWith(file);
    expect(returned).toEqual(response);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('sets error message from Error and rethrows', async () => {
    const file = new File(['x'], 'p.png', { type: 'image/png' });
    const err = new Error('Upload rejected');

    vi.mocked(uploadService.uploadProductImage).mockRejectedValueOnce(err);

    const { result } = renderHook(() => useUploadProductImage());

    await act(async () => {
      await expect(result.current.uploadImage(file)).rejects.toThrow(
        'Upload rejected',
      );
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Upload rejected');
    });
    expect(result.current.loading).toBe(false);
  });

  it('uses generic message for non-Error rejection', async () => {
    const file = new File(['x'], 'p.png', { type: 'image/png' });

    vi.mocked(uploadService.uploadProductImage).mockRejectedValueOnce('bad');

    const { result } = renderHook(() => useUploadProductImage());

    await act(async () => {
      await expect(result.current.uploadImage(file)).rejects.toBe('bad');
    });

    await waitFor(() => {
      expect(result.current.error).toBe('Image upload failed');
    });
    expect(result.current.loading).toBe(false);
  });
});
