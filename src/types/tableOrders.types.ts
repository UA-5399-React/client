export const ORDER_STATUS = {
  NEW: 'new',
  PENDING: 'pending',
  PAID: 'paid',
  SHIPPED: 'shipped',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus =
  | typeof ORDER_STATUS.NEW
  | typeof ORDER_STATUS.PENDING
  | typeof ORDER_STATUS.PAID
  | typeof ORDER_STATUS.SHIPPED
  | typeof ORDER_STATUS.CANCELLED;

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
