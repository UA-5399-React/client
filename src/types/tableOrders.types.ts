export const ORDER_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  SHIPPING: 'shipping',
  CANCELLED: 'cancelled',
} as const;

export const ALL_STATUS = 'all' as const;

export type OrderStatus =
  | typeof ORDER_STATUS.NEW
  | typeof ORDER_STATUS.PROCESSING
  | typeof ORDER_STATUS.COMPLETED
  | typeof ORDER_STATUS.SHIPPING
  | typeof ORDER_STATUS.CANCELLED;

export type OrderStatusFilter = OrderStatus | typeof ALL_STATUS;

export interface OrderItem {
  id: string;
  orderId: string;
  items: OrderedProduct[];
  user: OrderUser;
  amount: number;
  totalPrice: number;
  status: OrderStatus;
  createdAt: string;
}

export interface OrderedProduct {
  title: string;
  imageUrl: string;
  unitPrice: number;
  amount: number;
}

export interface OrderUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface OrdersPage {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  items: OrderItem[];
}

export interface GetOrdersData {
  orders: OrdersPage;
}
