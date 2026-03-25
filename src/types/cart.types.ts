import type { Product } from './product.types';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartResponse {
  userId: string;
  items: {
    product: Product;
    quantity: number;
    subtotal: number;
  }[];
  total: number;
}
