import { useState } from 'react';

import { uploadService } from '@/services';
import type { UploadProductImageResponse } from '@/types';

export function useUploadProductImage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = async (
    file: File,
  ): Promise<UploadProductImageResponse> => {
    try {
      setLoading(true);
      setError(null);
      return await uploadService.uploadProductImage(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { uploadImage, loading, error };
}
