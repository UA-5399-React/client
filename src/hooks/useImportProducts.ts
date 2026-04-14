import { useState } from 'react';
import { useApolloClient } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services/graphql/productAdminService';
import { productsImportService } from '@/services/productsImportService';
import type { ImportResult } from '@/types/import.types';

const MAX_FILE_SIZE_MB = 10;
const ACCEPTED_EXTENSIONS = ['.xlsx', '.csv'];

export function useImportProducts() {
  const client = useApolloClient();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ImportResult | null>(null);

  const validateFile = (file: File): string | null => {
    const ext = '.' + (file.name.split('.').pop()?.toLowerCase() ?? '');
    if (!ACCEPTED_EXTENSIONS.includes(ext)) {
      return `Only ${ACCEPTED_EXTENSIONS.join(', ')} files are accepted`;
    }
    if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
      return `File must be smaller than ${MAX_FILE_SIZE_MB} MB`;
    }
    return null;
  };

  const importProducts = async (file: File): Promise<void> => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await productsImportService.importProducts(file);
      setResult(data);
      await client.refetchQueries({ include: [GET_PRODUCTS_PAGE] });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Unexpected error during import',
      );
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setLoading(false);
    setError(null);
    setResult(null);
  };

  return { importProducts, loading, error, result, reset, validateFile };
}
