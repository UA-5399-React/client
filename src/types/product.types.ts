export type ProductStatus = 'active' | 'inactive' | 'draft';

export interface Product {
  id: string;
  imageUrl: string;
  price: number;
  title: string;
  status: ProductStatus;
  tags?: string[];
  description?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export interface ProductQueryParams {
  page: number;
  limit: number;
  search?: string;
  sort?: 'price' | 'title';
  order?: 'asc' | 'desc';
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}
export interface ProductsPageResult {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  items: Product[];
}
