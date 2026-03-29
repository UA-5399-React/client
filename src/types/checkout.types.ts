export const SHIPPING_CARRIERS = {
  NOVA_POST: 'nova_post',
  UKRPOSHTA: 'ukrposhta',
  MEEST: 'meest',
} as const;

export const PAYMENT_METHODS = {
  CASH_ON_DELIVERY: 'cash_on_delivery',
  STRIPE: 'stripe',
} as const;

export type ShippingCarrier =
  (typeof SHIPPING_CARRIERS)[keyof typeof SHIPPING_CARRIERS];

export type PaymentMethod =
  (typeof PAYMENT_METHODS)[keyof typeof PAYMENT_METHODS];

export interface CreateOrderItemPayload {
  product: string;
  amount: number;
}

export interface CreateShippingAddressPayload {
  carrier: ShippingCarrier;
  city: string;
  branchNumber: string;
}

export interface CreateOrderUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export interface CreateOrderPayload {
  items: CreateOrderItemPayload[];
  shippingAddress: CreateShippingAddressPayload;
  user: CreateOrderUserPayload;
  paymentMethod: PaymentMethod;
  message?: string;
}

export interface CreatedOrderItem {
  product: string;
  title: string;
  imageUrl?: string;
  unitPrice: number;
  amount: number;
}

export interface CreatedOrder {
  orderId: string;
  items: CreatedOrderItem[];
  totalPrice: number;
  amount: number;
  message?: string;
}

export interface CheckoutOrderSnapshot {
  orderId: string;
  amount: number;
  totalPrice: number;
  paymentMethod: PaymentMethod;
  items: CreatedOrderItem[];
  customerName: string;
}
