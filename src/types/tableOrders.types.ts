export const ORDER_STATUS = {
  NEW: 'New',
  PENDING: 'Pending',
  PAID: 'Paid',
  SHIPPED: 'Shipped',
  CANCELLED: 'Cancelled',
} as const;

export type OrderStatus =
  | typeof ORDER_STATUS.NEW
  | typeof ORDER_STATUS.PENDING
  | typeof ORDER_STATUS.PAID
  | typeof ORDER_STATUS.SHIPPED
  | typeof ORDER_STATUS.CANCELLED;

export interface OrderItem {
  id: string;
  productName: string;
  customerName: string;
  orderId: string;
  amount: number;
  status: OrderStatus;
  date: string;
  phone: string;
}
