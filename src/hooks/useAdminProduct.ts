import { useQuery } from '@apollo/client/react';

import { GET_PRODUCTS_PAGE } from '@/services';
import type { ProductsPageResult } from '@/types';
import type { ProductsFilters } from '@/types/filters';

export function useAdminProducts(
  page = 1,
  limit = 10,
  filters: Partial<ProductsFilters> = {},
) {
  const { data, loading, error } = useQuery<{
    productsPage: ProductsPageResult;
  }>(GET_PRODUCTS_PAGE, {
    variables: {
      limit,
      page,
    },
  });

  const productsPage = data?.productsPage;
  const allItems = productsPage?.items ?? [];

  const items = allItems.filter((product) => {
    if (filters.tags?.length) {
      const hasTag = filters.tags.some((tag) => product.tags?.includes(tag));
      if (!hasTag) return false;
    }

    if (filters.minPrice) {
      if (product.price < parseFloat(filters.minPrice)) return false;
    }

    if (filters.maxPrice) {
      if (product.price > parseFloat(filters.maxPrice)) return false;
    }

    if (filters.status) {
      if (product.status.toLowerCase() !== filters.status.toLowerCase())
        return false;
    }

    if (filters.dateFrom || filters.dateTo) {
      const field = filters.dateField ?? 'createdAt';
      const productDate = new Date(product[field]);

      if (filters.dateFrom) {
        if (productDate < new Date(filters.dateFrom)) return false;
      }
      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo);
        toDate.setHours(23, 59, 59, 999);
        if (productDate > toDate) return false;
      }
    }

    return true;
  });

  return {
    allItems,
    items,
    loading,
    error,
    totalPages: productsPage?.totalPages ?? 1,
    page: productsPage?.page ?? page,
  };
}
