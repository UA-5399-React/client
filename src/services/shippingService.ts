import type { CityOption, WarehouseOption } from '@/types';

import { apiClient } from './api';

export const shippingService = {
  getCities(search?: string): Promise<CityOption[]> {
    const params = search ? `?search=${encodeURIComponent(search)}` : '';
    return apiClient.get<CityOption[]>(`/shipping/cities${params}`);
  },

  getWarehouses(city: string, search?: string): Promise<WarehouseOption[]> {
    const params = new URLSearchParams({ city });
    if (search) params.set('search', search);
    return apiClient.get<WarehouseOption[]>(`/shipping/warehouses?${params}`);
  },
};
