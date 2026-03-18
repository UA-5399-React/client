export const PRODUCT_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  DRAFT: 'DRAFT',
} as const;

export type ProductStatus = 'active' | 'inactive' | 'draft';
export type ProductStatusUpperCase = Uppercase<ProductStatus>;

export interface Product {
  _id?: string;
  id: string;
  categories?: string[];
  imageUrl?: string;
  imagePublicId?: string;
  price: number;
  title: string;
  status: ProductStatus;
  tags?: string[];
  description?: string;

  //it's a workaround to pass build, because there are no fields for createdAt/updatedAt in mock data and storybooks(probably?). Overall these 2 fields should not be optional
  createdAt?: string;
  updatedAt?: string;
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

export interface ProductFormData {
  name: string;
  price: string;
  categories: string;
  status: ProductStatusUpperCase;
  description: string;
  imagePreview: string | null;
  imageFile?: File;
}

export interface UploadProductImageResponse {
  imageUrl: string;
  imagePublicId: string;
}
