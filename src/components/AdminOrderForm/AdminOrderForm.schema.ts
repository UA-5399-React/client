import z from 'zod';

import { SHIPPING_CARRIERS } from '@/types';
import { ORDER_STATUS } from '@/types/tableOrders.types';

export const orderFormSchema = z.object({
  customerName: z.string().trim().min(4, 'Customer name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  phone: z.string().trim().min(1, 'Phone is required'),
  carrier: z.enum([
    SHIPPING_CARRIERS.NOVA_POST,
    SHIPPING_CARRIERS.UKRPOSHTA,
    SHIPPING_CARRIERS.MEEST,
  ]),
  city: z.string().trim().min(3, 'City is required'),
  branchNumber: z.string().trim().min(1, 'Branch is required'),
  status: z.enum([
    ORDER_STATUS.NEW,
    ORDER_STATUS.PROCESSING,
    ORDER_STATUS.COMPLETED,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.SHIPPING,
  ]),
  items: z
    .array(
      z.object({
        productId: z.string().trim().min(1, 'Product is required'),
        productName: z.string().trim().min(1, 'Product is required'),
        price: z.string(),
        quantity: z
          .string()
          .trim()
          .min(1, 'Quantity is required')
          .refine(
            (value) => !Number.isNaN(Number(value)),
            'Quantity must be a number',
          )
          .refine((value) => Number(value) >= 1, 'Quantity must be at least 1')
          .refine(
            (value) => Number.isInteger(Number(value)),
            'Quantity must be integer',
          ),
      }),
    )
    .min(1, 'At least one product is required'),
});
