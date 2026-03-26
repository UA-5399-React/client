export const ORDER_STATUS = {
  NEW: 'new',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  SHIPPING: 'shipping',
  CANCELLED: 'cancelled',
} as const;

export type OrderStatus =
  | typeof ORDER_STATUS.NEW
  | typeof ORDER_STATUS.PROCESSING
  | typeof ORDER_STATUS.COMPLETED
  | typeof ORDER_STATUS.SHIPPING
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
  updatedAt?: string;
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

export interface OrderFormData {
  customerName: string;
  email: string;
  phone: string;
  status: OrderStatus;
  items: {
    productName: string;
    price: string;
    quantity: string;
  }[];
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
