export type OrderStatus =
  | 'new'
  | 'processed'
  | 'shipped'
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
