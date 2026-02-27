export type ProductStatus = 'active' | 'inactive' | 'draft'; 

export interface Product {
  id: string;
  imageUrl: string;
  status: ProductStatus;
  title: string;
  tags: string[];
  description: string;
  price: number;
}