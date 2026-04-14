export type OrderStatus =
  | 'new'
  | 'processed'
  | 'shipped'
  | 'completed'
  | 'cancelled';
export type ProgressStep = 'new' | 'processed' | 'shipped' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt?: string;
  status: OrderStatus;
  totalPrice: number;
}
export interface OrderDetailsItem {
  productId: string;
  title: string;
  imageUrl: string;
  unitPrice: number;
  amount: number;
  totalPrice: number;
}

export interface OrderDetails {
  orderNumber: string;
  createdAt?: string;
  completedAt?: string;
  totalPrice: number;
  items: OrderDetailsItem[];
  message?: string;
}
