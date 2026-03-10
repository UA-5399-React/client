export interface ProductsFilters {
  categories: string[];
  minPrice: string;
  maxPrice: string;
  status: string;
  dateFrom: string;
  dateTo: string;
  dateField: 'createdAt' | 'updatedAt';
}
