export type ProductSortField = 'updatedAt' | 'createdAt' | 'price' | 'title';
export type SortOrder = 'asc' | 'desc';

export type SortValue =
  | 'updated-desc'
  | 'created-desc'
  | 'created-asc'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc';
