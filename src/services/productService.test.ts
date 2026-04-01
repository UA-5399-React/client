import { describe, expect, it, vi } from 'vitest';

vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn().mockResolvedValue({ items: [], totalPages: 0 }),
  },
}));

import { apiClient } from './api';
import { productService } from './productService';

describe('service: productService', () => {
  it('omits blank price filters from shop requests', async () => {
    await productService.getAll(
      1,
      15,
      'title',
      undefined,
      ['cat-1'],
      '',
      '   ',
    );

    expect(apiClient.get).toHaveBeenCalledWith('/products', {
      params: {
        page: 1,
        limit: 15,
        sort: 'title',
        search: undefined,
        category: ['cat-1'],
        minPrice: undefined,
        maxPrice: undefined,
      },
    });
  });
});
