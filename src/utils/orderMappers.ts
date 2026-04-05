import type { ApiMyOrder, ApiOrderStatus } from '@/types/order.api.types';
import type { Order, OrderDetails, OrderStatus } from '@/types/order.types';

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

export const mapApiOrderToOrderDetails = (order: ApiMyOrder): OrderDetails => {
  const {
    orderId,
    createdAt,
    completedAt,
    updatedAt,
    totalPrice,
    items,
    message,
    status,
  } = order;

  let formattedCompletedAt: string | undefined;

  if (status === 'completed') {
    formattedCompletedAt = formatOrderDate(completedAt ?? updatedAt);
  }

  return {
    orderNumber: orderId,
    createdAt: formatOrderDate(createdAt),
    completedAt: formattedCompletedAt,
    totalPrice,
    items: items.map(({ product, title, imageUrl, unitPrice, amount }) => ({
      productId: product,
      title,
      imageUrl,
      unitPrice,
      amount,
      totalPrice: unitPrice * amount,
    })),
    message,
  };
};
