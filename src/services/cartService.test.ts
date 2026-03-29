import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from '@/services/api';

import { cartService } from './cartService';

vi.mock('@/services/api', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}));

describe('cartService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const mockCartResponse = {
    userId: 'user-1',
    items: [
      {
        product: { id: 'prod-1', name: 'Product 1', price: 100 },
        quantity: 2,
        subtotal: 200,
      },
    ],
    total: 200,
  };

  it('syncCart should call apiClient.post with /cart/sync', async () => {
    const items = [{ productId: 'prod-1', quantity: 2 }];
    vi.mocked(apiClient.post).mockResolvedValue(mockCartResponse);

    const result = await cartService.syncCart(items);

    expect(apiClient.post).toHaveBeenCalledWith('/cart/sync', { items });
    expect(result).toEqual(mockCartResponse);
  });

  it('updateCart should call apiClient.post with /cart', async () => {
    const items = [{ productId: 'prod-1', quantity: 2 }];
    vi.mocked(apiClient.post).mockResolvedValue(mockCartResponse);

    const result = await cartService.updateCart(items);

    expect(apiClient.post).toHaveBeenCalledWith('/cart', { items });
    expect(result).toEqual(mockCartResponse);
  });

  it('getCart should call apiClient.get with /cart', async () => {
    vi.mocked(apiClient.get).mockResolvedValue(mockCartResponse);

    const result = await cartService.getCart();

    expect(apiClient.get).toHaveBeenCalledWith('/cart');
    expect(result).toEqual(mockCartResponse);
  });
});
