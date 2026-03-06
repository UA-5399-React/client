import type { Product } from '@/types';
import type { ProductsFilters } from '@/types/filters';

export const matchCategory = (product: Product, tags?: string[]): boolean => {
  if (!tags?.length) return true;
  return tags.some((tag) => product.tags?.includes(tag));
};

export const matchPrice = (
  product: Product,
  filters: Partial<ProductsFilters>,
): boolean => {
  if (filters.minPrice && product.price < parseFloat(filters.minPrice))
    return false;
  if (filters.maxPrice && product.price > parseFloat(filters.maxPrice))
    return false;
  return true;
};

export const matchStatus = (product: Product, status?: string): boolean => {
  if (!status) return true;
  return product.status === status;
};

export const matchDate = (
  product: Product,
  filters: Partial<ProductsFilters>,
): boolean => {
  if (!filters.dateFrom && !filters.dateTo) return true;

  const field = filters.dateField ?? 'createdAt';
  const productDate = new Date(product[field] || ''); //it's a workaround to pass build, because there are no fields for createdAt/updatedAt in mock data and storybooks(probably?)

  if (filters.dateFrom && productDate < new Date(filters.dateFrom))
    return false;
  if (filters.dateTo) {
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    if (productDate > toDate) return false;
  }

  return true;
};
