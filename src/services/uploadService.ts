import { API_BASE_URL } from '@/constants';
import type { UploadProductImageResponse } from '@/types';

export const uploadService = {
  async uploadProductImage(file: File): Promise<UploadProductImageResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/uploads/products`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response
        .json()
        .catch(() => ({ message: 'Image upload failed' }));

      throw new Error(errorData.message || 'Image upload failed');
    }

    return response.json();
  },
};
