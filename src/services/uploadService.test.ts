import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import { API_BASE_URL } from '@/constants';

import { uploadService } from './uploadService';

global.fetch = vi.fn();

describe('Service: uploadService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('uploads image as FormData and returns upload metadata', async () => {
    const file = new File(['image-bytes'], 'product.png', {
      type: 'image/png',
    });
    const mockResponse = {
      imageUrl:
        'https://res.cloudinary.com/demo/image/upload/products/test.png',
      imagePublicId: 'products/test',
    };

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const result = await uploadService.uploadProductImage(file);

    expect(global.fetch).toHaveBeenCalledTimes(1);

    const [url, options] = (global.fetch as Mock).mock.calls[0] as [
      string,
      RequestInit,
    ];

    expect(url).toBe(`${API_BASE_URL}/uploads/products`);
    expect(options.method).toBe('POST');
    expect(options.body).toBeInstanceOf(FormData);

    const formData = options.body as FormData;
    expect(formData.get('file')).toBe(file);
    expect(result).toEqual(mockResponse);
  });

  it('throws backend error message when upload fails', async () => {
    const file = new File(['image-bytes'], 'product.png', {
      type: 'image/png',
    });

    (global.fetch as Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({ message: 'Cloudinary upload failed' }),
    });

    await expect(uploadService.uploadProductImage(file)).rejects.toThrow(
      'Cloudinary upload failed',
    );
  });
});
