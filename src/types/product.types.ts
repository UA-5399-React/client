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

export interface ProductsPageResult {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  items: Product[];
}
