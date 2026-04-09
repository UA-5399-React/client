export const PRODUCT_SORT_FIELDS = {
  UPDATED_AT: 'updatedAt',
  CREATED_AT: 'createdAt',
  PRICE: 'price',
  TITLE: 'title',
  PURCHASE_COUNT: 'purchaseCount',
} as const;

export type ProductSortField =
  | typeof PRODUCT_SORT_FIELDS.UPDATED_AT
  | typeof PRODUCT_SORT_FIELDS.CREATED_AT
  | typeof PRODUCT_SORT_FIELDS.PRICE
  | typeof PRODUCT_SORT_FIELDS.TITLE
  | typeof PRODUCT_SORT_FIELDS.PURCHASE_COUNT;

export type SortOrder = 'asc' | 'desc';

export type SortValue =
  | 'updated-desc'
  | 'created-desc'
  | 'created-asc'
  | 'price-asc'
  | 'price-desc'
  | 'title-asc'
  | 'title-desc'
  | 'purchaseCount-asc'
  | 'purchaseCount-desc';
