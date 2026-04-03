import { Controller, useFieldArray, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX } from 'lucide-react';

import { Button, Dropdown, Input, OrderProductSearch } from '@/components';
import { ORDER_STATUS, type OrderFormData } from '@/types/tableOrders.types';
import { formatDateToShort } from '@/utils/date.utils';

import type { DropdownOption } from '../Dropdown/Dropdown.types';
import { orderFormSchema } from './AdminOrderForm.schema';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: 'New', value: ORDER_STATUS.NEW },
  { label: 'Processing', value: ORDER_STATUS.PROCESSING },
  { label: 'Completed', value: ORDER_STATUS.COMPLETED },
  { label: 'Cancelled', value: ORDER_STATUS.CANCELLED },
  { label: 'Shipped', value: ORDER_STATUS.SHIPPING },
];

interface OrderFormProps {
  initialData?: Partial<OrderFormData>;
  onSubmit: (data: OrderFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  updatedAt?: string;
}

export function AdminOrderForm({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode = false,
  updatedAt,
}: OrderFormProps) {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<OrderFormData>({
    resolver: zodResolver(orderFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      customerName: initialData?.customerName || '',
      email: initialData?.email || '',
      phone: initialData?.phone || '',
      status: initialData?.status || ORDER_STATUS.NEW,
      items:
        initialData?.items && initialData.items.length > 0
          ? initialData.items
          : [{ productName: '', price: '', quantity: '1' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const items = useWatch({ control, name: 'items' });
  const total =
    items?.reduce(
      (sum, item) =>
        sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
      0,
    ) || 0;

  const isDisabled = isLoading || isSubmitting;

  return (
    <div className="bg-backgroundSec rounded-lg border border-gray-200 p-4 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-4 align-top md:grid-cols-2">
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

        <div className="flex flex-col gap-4">
          {fields.map((item, index) => (
            <div key={item.id}>
              <div className="grid grid-cols-[8fr_1fr_1fr_0.3fr] items-start gap-3 max-md:grid-cols-1">
                <OrderProductSearch
                  index={index}
                  control={control}
                  setValue={setValue}
                  getValues={getValues}
                  disabled={isDisabled}
                  error={errors.items?.[index]?.productName?.message}
                />

                <Controller
                  control={control}
                  name={`items.${index}.price`}
                  disabled={true}
                  render={({ field }) => (
                    <Input
                      label="Price: $"
                      type="number"
                      placeholder="0"
                      inputClassName="bg-white text-black h-[26px]"
                      {...field}
                      value={field.value ?? ''}
                      state={errors.items?.[index]?.price ? 'error' : 'default'}
                      helperText={errors.items?.[index]?.price?.message}
                    />
                  )}
                />

                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  render={({ field }) => (
                    <Input
                      label="Quantity"
                      type="number"
                      placeholder="0"
                      inputClassName="bg-white text-black h-[26px]"
                      {...field}
                      value={field.value ?? ''}
                      state={
                        errors.items?.[index]?.quantity ? 'error' : 'default'
                      }
                      helperText={errors.items?.[index]?.quantity?.message}
                    />
                  )}
                />

                <div className="flex h-[70px] flex-col items-center gap-1.5">
                  <div className="h-[20px]"></div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      aria-label="Remove product row"
                      onClick={() => remove(index)}
                      disabled={isDisabled}
                      className="mt-2 rounded-md bg-transparent p-0! text-xs text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <CircleX className="h-6 w-6" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          ))}

          <div className="w-full">
            <Button
              type="button"
              onClick={() =>
                append({ productName: '', price: '', quantity: '1' })
              }
              disabled={isDisabled}
              className="text-neutral-0 w-full rounded-md border border-gray-300 bg-green-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Add product
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-end text-sm font-medium text-gray-700 dark:text-gray-200">
          Total: ${total.toFixed(2)}
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isEditMode && updatedAt && (
              <span>Last Update: {formatDateToShort(new Date(updatedAt))}</span>
            )}
          </div>
          <div className="flex justify-end gap-3">
            <Button
              type="submit"
              disabled={isDisabled}
              className={`cursor-pointer rounded-md border-0 bg-green-500 px-5 py-1.5 text-white hover:bg-green-500/90 ${
                isDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </Button>

            <Button
              type="button"
              onClick={onCancel}
              disabled={isDisabled}
              className="bg-background text-text cursor-pointer rounded-md border border-gray-300! px-5 py-1.5"
            >
              Cancel
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
