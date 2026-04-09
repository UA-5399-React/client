import { API_BASE_URL } from '@/constants';

export const exportService = {
  exportProducts: async (): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export/products`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to export products');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Server returned an error instead of a file',
      );
    }

    return await response.blob();
  },

  exportOrders: async (): Promise<Blob> => {
    const response = await fetch(`${API_BASE_URL}/export/orders`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to export orders');
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || 'Server returned an error instead of a file',
      );
    }

    return await response.blob();
  },
};
