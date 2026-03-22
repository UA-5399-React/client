export type OrderStatus =
  | 'new'
  | 'processing'
  | 'shipping'
  | 'completed'
  | 'cancelled';
export type ProgressStep = 'processed' | 'shipped' | 'completed';

export interface Order {
  id: string;
  orderNumber: string;
  createdAt?: string;
  status: OrderStatus;
  totalPrice: number;
}
