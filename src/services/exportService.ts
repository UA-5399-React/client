import { API_BASE_URL, API_ENDPOINTS } from '@/constants';

export interface ExportProductsParams {
  status?: string;
  search?: string;
  category?: string[];
  minPrice?: string;
  maxPrice?: string;
  dateFrom?: string;
  dateTo?: string;
  dateField?: 'createdAt' | 'updatedAt';
}

export interface ExportOrdersParams {
  status?: string;
  search?: string;
}

export const exportService = {
  exportProducts: async (params?: ExportProductsParams): Promise<Blob> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.append('status', params.status);
      if (params.search) query.append('search', params.search);
      if (params.category && params.category.length > 0) {
        params.category.forEach((c) => query.append('category', c));
      }
      if (params.minPrice) query.append('minPrice', params.minPrice);
      if (params.maxPrice) query.append('maxPrice', params.maxPrice);
      if (params.dateFrom) query.append('dateFrom', params.dateFrom);
      if (params.dateTo) query.append('dateTo', params.dateTo);
      if (params.dateField) query.append('dateField', params.dateField);
    }
    const queryString = query.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.EXPORT_PRODUCTS}${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to export products');
    }

    return await response.blob();
  },

  exportOrderPDF: async (orderId: string): Promise<Blob> => {
    const response = await fetch(
      `${API_BASE_URL}${API_ENDPOINTS.EXPORT_ORDER_PDF(orderId)}`,
      {
        method: 'GET',
        credentials: 'include',
      },
    );

    if (!response.ok) {
      throw new Error('Failed to generate PDF');
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

  exportOrders: async (params?: ExportOrdersParams): Promise<Blob> => {
    const query = new URLSearchParams();
    if (params) {
      if (params.status) query.append('status', params.status);
      if (params.search) query.append('search', params.search);
    }
    const queryString = query.toString();
    const url = `${API_BASE_URL}${API_ENDPOINTS.EXPORT_ORDERS}${queryString ? `?${queryString}` : ''}`;
    const response = await fetch(url, {
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
