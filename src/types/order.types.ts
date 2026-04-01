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
