import { useEffect, useState } from 'react';

import { apiClient } from '@/services/api';
import type { Product } from '@/types/product.types';

interface FeaturedProductResponse {
  productId: Product | string;
  type: string;
  position: number;
}

export const useFeaturedProducts = (type: string) => {
  const [data, setData] = useState<{ items: Product[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setIsLoading(true);
        const response = await apiClient.get<FeaturedProductResponse[]>(
          `/featured-products/${type}`,
        );

        const items = response
          .map((item) => item.productId)
          .filter((p): p is Product => typeof p === 'object' && p !== null);

        setData({ items });
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFeatured();
  }, [type]);

  return { data, isLoading, isError };
};
