import { API_BASE_URL } from '@/constants';
import type { ImportResult } from '@/types/import.types';

export const productsImportService = {
  async importProducts(file: File): Promise<ImportResult> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/admin/products/import`, {
      method: 'POST',
      credentials: 'include',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Import failed' }));
      const message = Array.isArray(errorData.message)
        ? errorData.message[0]
        : (errorData.message ?? 'Import failed');
      throw new Error(message);
    }

    return response.json() as Promise<ImportResult>;
  },
};
