import clsx from 'clsx';
import { z } from 'zod';

import { PAYMENT_METHODS, SHIPPING_CARRIERS } from '@/types';

export const fieldLabelClassName =
  'text-[12px] font-bold uppercase tracking-[0.02em] text-gray-600';

const baseFieldClassName =
  'box-border h-10 w-full max-w-full rounded-md border px-[15px] text-sm outline-none transition-colors placeholder:text-gray-600';

export const checkoutSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  phone: z.string().trim().min(1, 'Phone number is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),
  carrier: z.enum([
    SHIPPING_CARRIERS.NOVA_POST,
    SHIPPING_CARRIERS.UKRPOSHTA,
    SHIPPING_CARRIERS.MEEST,
  ]),
  city: z.string().trim().min(1, 'Town / City is required'),
  branchNumber: z.string().trim().min(1, 'Department code is required'),
  paymentMethod: z.enum([
    PAYMENT_METHODS.STRIPE,
    PAYMENT_METHODS.CASH_ON_DELIVERY,
  ]),
  message: z.string().optional(),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;
export type CheckoutFieldName = keyof CheckoutFormValues;

export const carrierOptions = [
  { value: SHIPPING_CARRIERS.NOVA_POST, label: 'Нова Пошта' },
  { value: SHIPPING_CARRIERS.UKRPOSHTA, label: 'Укрпошта' },
  { value: SHIPPING_CARRIERS.MEEST, label: 'Meest' },
] as const;

export const checkoutFieldNames: CheckoutFieldName[] = [
  'firstName',
  'lastName',
  'phone',
  'email',
  'carrier',
  'city',
  'branchNumber',
  'paymentMethod',
  'message',
];

export const isMongoId = (value?: string) =>
  Boolean(value && /^[a-f\d]{24}$/i.test(value));

export const readControlValue = (
  control: Element | RadioNodeList | null,
): string | null => {
  if (!control) {
    return null;
  }

  if (
    typeof RadioNodeList !== 'undefined' &&
    control instanceof RadioNodeList
  ) {
    const checkedInput = Array.from(control).find(
      (item): item is HTMLInputElement =>
        item instanceof HTMLInputElement && item.checked,
    );

    return checkedInput?.value ?? null;
  }

  if (
    control instanceof HTMLInputElement ||
    control instanceof HTMLTextAreaElement ||
    control instanceof HTMLSelectElement
  ) {
    return control.value;
  }

  return null;
};

export const getFieldClassName = (isDark: boolean, hasError = false) =>
  clsx(
    baseFieldClassName,
    isDark
      ? 'border-gray-700 bg-black text-white'
      : 'border-[#CBCBCB] bg-white text-[#141718]',
    hasError &&
      (isDark ? 'border-red-500 text-red-200' : 'border-red-500 text-red-600'),
  );

export const formatCurrency = (value: number) => `$${value.toFixed(2)}`;
