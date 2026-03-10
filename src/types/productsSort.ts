export const PRODUCT_SORT_FIELDS = {
  UPDATED_AT: 'updatedAt',
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  TITLE: 'title',
} as const;

export type ProductSortField =
  | typeof PRODUCT_SORT_FIELDS.UPDATED_AT
  | typeof PRODUCT_SORT_FIELDS.CREATED_AT
  | typeof PRODUCT_SORT_FIELDS.PRICE
  | typeof PRODUCT_SORT_FIELDS.TITLE;

export type SortOrder = 'asc' | 'desc';

export type SortValue =
  | 'updated-desc'
  | 'created-desc'
  | 'created-asc'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc';
