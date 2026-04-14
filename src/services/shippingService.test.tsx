import { beforeEach, describe, expect, it, vi } from 'vitest';

import { apiClient } from './api';
import { shippingService } from './shippingService';

vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('Service: shippingService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getCities', () => {
    it('fetches cities without search param', async () => {
      const mockCities = [{ name: 'Kyiv', area: 'Kyivska' }];
      vi.mocked(apiClient.get).mockResolvedValue(mockCities);

      const result = await shippingService.getCities();

      expect(apiClient.get).toHaveBeenCalledWith('/shipping/cities');
      expect(result).toEqual(mockCities);
    });

    it('fetches cities with search param', async () => {
      const mockCities = [{ name: 'Lviv', area: 'Lvivska' }];
      vi.mocked(apiClient.get).mockResolvedValue(mockCities);

      const result = await shippingService.getCities('Lv');

      expect(apiClient.get).toHaveBeenCalledWith('/shipping/cities?search=Lv');
      expect(result).toEqual(mockCities);
    });
  });

  describe('getWarehouses', () => {
    it('fetches warehouses for a city without search param', async () => {
      const mockWarehouses = [{ number: '1', label: 'Warehouse 1' }];
      vi.mocked(apiClient.get).mockResolvedValue(mockWarehouses);

      const result = await shippingService.getWarehouses('Kyiv');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/shipping/warehouses?city=Kyiv',
      );
      expect(result).toEqual(mockWarehouses);
    });

    it('fetches warehouses for a city with search param', async () => {
      const mockWarehouses = [{ number: '2', label: 'Warehouse 2' }];
      vi.mocked(apiClient.get).mockResolvedValue(mockWarehouses);

      const result = await shippingService.getWarehouses('Kyiv', '2');

      expect(apiClient.get).toHaveBeenCalledWith(
        '/shipping/warehouses?city=Kyiv&search=2',
      );
      expect(result).toEqual(mockWarehouses);
    });
  });
});
