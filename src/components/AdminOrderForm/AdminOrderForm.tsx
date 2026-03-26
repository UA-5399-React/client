import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Dropdown, Input } from '@/components';
import { ORDER_STATUS, type OrderFormData } from '@/types/tableOrders.types';

import type { DropdownOption } from '../Dropdown/Dropdown.types';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: 'New', value: ORDER_STATUS.NEW },
  { label: 'Processing', value: ORDER_STATUS.PENDING },
  { label: 'Completed', value: ORDER_STATUS.PAID },
  { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  { label: 'Shipped', value: ORDER_STATUS.SHIPPED },
];

const orderFormSchema = z.object({
  customerName: z.string().trim().min(1, 'Customer name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email'),
  phone: z.string().trim().min(1, 'Phone is required'),
  status: z.enum([
    ORDER_STATUS.NEW,
    ORDER_STATUS.PENDING,
    ORDER_STATUS.PAID,
    ORDER_STATUS.CANCELLED,
    ORDER_STATUS.SHIPPED,
  ]),
  productName: z.string().trim().min(1, 'Product is required'),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((value) => !Number.isNaN(Number(value)), 'Price must be a number')
    .refine((value) => Number(value) >= 0, 'Price must be at least 0'),
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
});

interface OrderFormProps {
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function AdminOrderForm({
  onSubmit,
  onCancel,
  isLoading,
}: OrderFormProps) {
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      customerName: '',
      email: '',
      phone: '',
      status: ORDER_STATUS.NEW,
      productName: '',
      price: '',
      quantity: '1',
    },
  });

  const price = useWatch({ control, name: 'price' });
  const quantity = useWatch({ control, name: 'quantity' });
  const total = (Number(price) || 0) * (Number(quantity) || 0);

  const isDisabled = isLoading || isSubmitting;

  return (
    <div className="rounded-lg border border-gray-200 bg-[rgb(var(--color-bg-sec))] p-4 shadow-sm dark:border-gray-800">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <Controller
            control={control}
            name="customerName"
            render={({ field }) => (
              <Input
                label="Customer Name"
                placeholder="Name"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.customerName ? 'error' : 'default'}
                helperText={errors.customerName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="email"
            render={({ field }) => (
              <Input
                label="Email"
                type="email"
                placeholder="Email"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.email ? 'error' : 'default'}
                helperText={errors.email?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="phone"
            render={({ field }) => (
              <Input
                label="Phone"
                placeholder="Phone"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.phone ? 'error' : 'default'}
                helperText={errors.phone?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <div className="w-full *:flex! *:flex-col! *:items-start!">
                <Dropdown
                  label="Status"
                  labelClassName="!text-left !text-sm !font-medium !text-tex !normal-case"
                  selectClassName="w-full border-color-red-300! border-1! rounded-md !bg-white"
                  options={STATUS_OPTIONS}
                  selectedValues={field.value ? [field.value] : []}
                  onChange={(values) => {
                    const newValue = values?.[0];
                    if (newValue) {
                      field.onChange(newValue.value || newValue);
                    }
                  }}
                  placeholder="Select status"
                  multiple={false}
                />
              </div>
            )}
          />
        </div>

        <div className="grid grid-cols-[8fr_1fr_1fr] gap-3">
          <Controller
            control={control}
            name="productName"
            render={({ field }) => (
              <Input
                label="Search product"
                placeholder="Search product"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.productName ? 'error' : 'default'}
                helperText={errors.productName?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                label="Price: $"
                type="number"
                placeholder="0"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.price ? 'error' : 'default'}
                helperText={errors.price?.message}
              />
            )}
          />

          <Controller
            control={control}
            name="quantity"
            render={({ field }) => (
              <Input
                label="Quantity"
                type="number"
                placeholder="0"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.quantity ? 'error' : 'default'}
                helperText={errors.quantity?.message}
              />
            )}
          />
        </div>

        <div className="flex items-center justify-end text-sm font-medium text-gray-700 dark:text-gray-200">
          Total: ${total.toFixed(2)}
        </div>

        <div className="flex justify-end gap-3">
          <button
            type="submit"
            disabled={isDisabled}
            className={`cursor-pointer rounded-md border-0 bg-green-500 px-5 py-1.5 text-white hover:bg-green-500/90 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isDisabled ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
