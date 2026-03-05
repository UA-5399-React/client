export interface ProductsFilters {
  tags: string[];
  minPrice: string;
  maxPrice: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  dateField: 'createdAt' | 'updatedAt';
}

export const DEFAULT_FILTERS: ProductsFilters = {
  tags: [],
  minPrice: '',
  maxPrice: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  dateField: 'createdAt',
};
