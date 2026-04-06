export type ApiOrderStatus =
  | 'new'
  | 'processing'
  | 'shipping'
  | 'completed'
  | 'cancelled';

export interface ApiOrderItem {
  product: string;
  title: string;
  imageUrl: string;
  unitPrice: number;
  amount: number;
}

export interface ApiShippingAddress {
  carrier: string;
  city: string;
  branchNumber: string;
}

export interface ApiOrderUser {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface ApiOrderPayment {
  method: string;
  status: string;
  stripePaymentIntentId?: string;
}

export interface ApiMyOrder {
  orderId: string;
  userId: object;
  items: ApiOrderItem[];
  amount: number;
  totalPrice: number;
  shippingAddress: ApiShippingAddress;
  status: ApiOrderStatus;
  user: ApiOrderUser;
  updatedAt?: string;
  completedAt?: string;
  payment: ApiOrderPayment;
  message?: string;
  createdAt?: string;
}
