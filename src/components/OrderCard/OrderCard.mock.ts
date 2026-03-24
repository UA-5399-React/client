import type { Order } from '@/types/order.types';

export const MOCK_ORDERS: Order[] = [
  {
    id: '1',
    orderNumber: '#3456_768',
    createdAt: 'December 1, 2025',
    status: 'processed',
    totalPrice: 1234.0,
  },
  {
    id: '2',
    orderNumber: '#3456_980',
    createdAt: 'October 11, 2023',
    status: 'completed',
    totalPrice: 345.0,
  },
  {
    id: '3',
    orderNumber: '#3456_230',
    createdAt: 'April 13, 2023',
    status: 'shipped',
    totalPrice: 120.0,
  },
  {
    id: '4',
    orderNumber: '#3456_120',
    createdAt: 'January 14, 2023',
    status: 'cancelled',
    totalPrice: 50.0,
  },
];
