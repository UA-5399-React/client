import type { ApiMyOrder, ApiOrderStatus } from '@/types/order.api.types';
import type { Order, OrderStatus } from '@/types/order.types';

const mapApiOrderStatus = (status: ApiOrderStatus): OrderStatus => {
  switch (status) {
    case 'processing':
      return 'processed';
    case 'shipping':
      return 'shipped';
    default:
      return status;
  }
};

const formatOrderDate = (date?: string): string | undefined => {
  if (!date) return undefined;

  return new Date(date).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
};

export const mapApiOrderToOrder = (order: ApiMyOrder): Order => {
  return {
    id: order.orderId,
    orderNumber: order.orderId,
    createdAt: formatOrderDate(order.createdAt),
    status: mapApiOrderStatus(order.status),
    totalPrice: order.totalPrice,
  };
};
