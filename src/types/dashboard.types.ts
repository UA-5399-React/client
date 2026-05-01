export interface OrderStatusSegment {
  status: 'new' | 'completed' | 'processing' | 'cancelled' | 'shipping';
  count: number;
  percentage: number;
}

export interface OrdersStatusStats {
  total: number;
  statuses: OrderStatusSegment[];
}
