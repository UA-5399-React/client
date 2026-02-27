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