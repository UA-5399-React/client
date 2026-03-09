import type {
  ProductSortField,
  SortOrder,
  SortValue,
} from '@/types/productsSort';

// Builds a string sort value from sort field and order
export function buildSortValue(
  sort: ProductSortField,
  order: SortOrder,
): SortValue {
  if (sort === 'updatedAt' && order === 'desc') return 'updated-desc';
  if (sort === 'createdAt' && order === 'desc') return 'created-desc';
  if (sort === 'createdAt' && order === 'asc') return 'created-asc';
  if (sort === 'price' && order === 'asc') return 'price-asc';
  if (sort === 'price' && order === 'desc') return 'price-desc';
  if (sort === 'title' && order === 'asc') return 'title-asc';
  return 'title-desc';
}

// Parses sort value string into structured sorting parameters
export function parseSortValue(value: SortValue): {
  sort: ProductSortField;
  order: SortOrder;
} {
  switch (value) {
    case 'updated-desc':
      return { sort: 'updatedAt', order: 'desc' };
    case 'created-desc':
      return { sort: 'createdAt', order: 'desc' };
    case 'created-asc':
      return { sort: 'createdAt', order: 'asc' };
    case 'price-asc':
      return { sort: 'price', order: 'asc' };
    case 'price-desc':
      return { sort: 'price', order: 'desc' };
    case 'title-asc':
      return { sort: 'title', order: 'asc' };
    case 'title-desc':
      return { sort: 'title', order: 'desc' };
  }
}
