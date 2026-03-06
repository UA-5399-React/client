export interface ProductsFilters {
  tags: string[];
  minPrice: string;
  maxPrice: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  dateField: 'createdAt' | 'updatedAt';
}
