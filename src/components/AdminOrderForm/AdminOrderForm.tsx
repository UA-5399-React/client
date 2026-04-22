import { useCallback, useEffect, useState } from 'react';
import {
  Controller,
  useController,
  useFieldArray,
  useForm,
  useWatch,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CircleX } from 'lucide-react';

import { Button, Dropdown, Input, OrderProductSearch } from '@/components';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { SearchableSelect } from '@/pages/Checkout/SearchableSelect';
import { shippingService } from '@/services';
import { SHIPPING_CARRIERS } from '@/types';
import type { CityOption, WarehouseOption } from '@/types/shipping.types';
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

const CARRIER_OPTIONS: DropdownOption[] = [
  { label: 'Nova Poshta', value: SHIPPING_CARRIERS.NOVA_POST },
  { label: 'Ukrposhta', value: SHIPPING_CARRIERS.UKRPOSHTA },
  { label: 'Meest', value: SHIPPING_CARRIERS.MEEST },
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
      carrier: initialData?.carrier || SHIPPING_CARRIERS.NOVA_POST,
      city: initialData?.city || '',
      branchNumber: initialData?.branchNumber || '',
      status: initialData?.status || ORDER_STATUS.NEW,
      items:
        initialData?.items && initialData.items.length > 0
          ? initialData.items
          : [{ productId: '', productName: '', price: '', quantity: '1' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });
  const [cities, setCities] = useState<CityOption[]>([]);
  const [warehouses, setWarehouses] = useState<WarehouseOption[]>([]);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [warehousesLoading, setWarehousesLoading] = useState(false);
  const [citySearch, setCitySearch] = useState('');
  const [warehouseSearch, setWarehouseSearch] = useState('');

  const items = useWatch({ control, name: 'items' });
  const carrier = useWatch({ control, name: 'carrier' });
  const { field: cityField } = useController({ control, name: 'city' });
  const { field: branchField } = useController({
    control,
    name: 'branchNumber',
  });
  const total =
    items?.reduce(
      (sum, item) =>
        sum + (Number(item?.price) || 0) * (Number(item?.quantity) || 0),
      0,
    ) || 0;
  const isNovaPostCarrier = carrier === SHIPPING_CARRIERS.NOVA_POST;
  const debouncedCitySearch = useDebouncedValue(citySearch, 300);
  const debouncedWarehouseSearch = useDebouncedValue(warehouseSearch, 300);

  const isDisabled = isLoading || isSubmitting;

  const fetchCities = useCallback(async (search?: string) => {
    setCitiesLoading(true);
    try {
      const data = await shippingService.getCities(search);
      setCities(data);
    } catch {
      setCities([]);
    } finally {
      setCitiesLoading(false);
    }
  }, []);

  const fetchWarehouses = useCallback(async (city: string, search?: string) => {
    if (!city) return;
    setWarehousesLoading(true);
    try {
      const data = await shippingService.getWarehouses(city, search);
      setWarehouses(data);
    } catch {
      setWarehouses([]);
    } finally {
      setWarehousesLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isNovaPostCarrier) {
      setCities([]);
      setWarehouses([]);
      setCitySearch('');
      setWarehouseSearch('');
      return;
    }

    fetchCities(debouncedCitySearch);
  }, [debouncedCitySearch, fetchCities, isNovaPostCarrier]);

  useEffect(() => {
    if (!isNovaPostCarrier) return;
    if (!cityField.value) {
      setWarehouses([]);
      return;
    }

    fetchWarehouses(cityField.value, debouncedWarehouseSearch);
  }, [
    cityField.value,
    debouncedWarehouseSearch,
    fetchWarehouses,
    isNovaPostCarrier,
  ]);

  const cityOptions = cities.map((c) => ({
    value: c.name,
    label: `${c.name} (${c.area})`,
  }));

  const warehouseOptions = warehouses.map((w) => ({
    value: w.number,
    label: w.label,
  }));

  return (
    <div className="bg-backgroundSec rounded-lg border border-gray-200 p-4 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 gap-x-4 gap-y-2 align-top md:grid-cols-2">
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
                required
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
                required
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
                required
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
                  required
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="carrier"
            render={({ field }) => (
              <div className="w-full *:flex! *:flex-col! *:items-start!">
                <Dropdown
                  label="Carrier"
                  labelClassName="!text-left !text-sm !font-medium !text-tex !normal-case"
                  selectClassName="w-full border-color-red-300! border-1! rounded-md !bg-white"
                  options={CARRIER_OPTIONS}
                  selectedValues={field.value ? [field.value] : []}
                  onChange={(values) => {
                    const newValue = values?.[0];
                    if (newValue) {
                      const selectedCarrier = newValue.value || newValue;
                      field.onChange(selectedCarrier);
                      cityField.onChange('');
                      branchField.onChange('');
                      setWarehouses([]);
                      if (selectedCarrier === SHIPPING_CARRIERS.NOVA_POST) {
                        fetchCities();
                      } else {
                        setCities([]);
                      }
                    }
                  }}
                  placeholder="Select carrier"
                  multiple={false}
                  required
                />
                {errors.carrier?.message && (
                  <span className="mt-1 text-xs text-red-500">
                    {errors.carrier.message}
                  </span>
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <div className="w-full">
                {isNovaPostCarrier ? (
                  <>
                    <span className="mb-1 block text-sm font-medium text-[#141718]">
                      City <span className="font-bold text-red-500">*</span>
                    </span>
                    <SearchableSelect
                      isDark={false}
                      hasError={Boolean(errors.city)}
                      value={field.value ?? ''}
                      onChange={(value) => {
                        field.onChange(value);
                        branchField.onChange('');
                        setWarehouses([]);
                        setWarehouseSearch('');
                        fetchWarehouses(value);
                      }}
                      placeholder="Choose city"
                      options={cityOptions}
                      isLoading={citiesLoading}
                      onSearchChange={(s) => setCitySearch(s)}
                    />

                    <span className="mt-1 block h-2 text-xs text-red-500">
                      {errors.city?.message}
                    </span>
                  </>
                ) : (
                  <Input
                    label="City"
                    placeholder="City"
                    inputClassName="bg-white text-black"
                    {...field}
                    value={field.value ?? ''}
                    state={errors.city ? 'error' : 'default'}
                    helperText={errors.city?.message}
                    required
                  />
                )}
              </div>
            )}
          />

          <Controller
            control={control}
            name="branchNumber"
            render={({ field }) => (
              <div className="w-full">
                {isNovaPostCarrier ? (
                  <>
                    <span className="mb-1 block text-sm font-medium text-[#141718]">
                      Branch Number{' '}
                      <span className="font-bold text-red-500">*</span>
                    </span>
                    <SearchableSelect
                      isDark={false}
                      hasError={Boolean(errors.branchNumber)}
                      value={field.value ?? ''}
                      onChange={field.onChange}
                      placeholder={
                        cityField.value
                          ? 'Choose warehouse'
                          : 'First, select a city'
                      }
                      options={warehouseOptions}
                      isLoading={warehousesLoading}
                      disabled={!cityField.value}
                      onSearchChange={(s) => setWarehouseSearch(s)}
                    />

                    <span className="mt-1 block h-2 text-xs text-red-500">
                      {errors.branchNumber?.message}
                    </span>
                  </>
                ) : (
                  <Input
                    label="Branch Number"
                    placeholder="Branch number"
                    inputClassName="bg-white text-black"
                    {...field}
                    value={field.value ?? ''}
                    state={errors.branchNumber ? 'error' : 'default'}
                    helperText={errors.branchNumber?.message}
                    required
                  />
                )}
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

          <div className="w-full pt-2">
            <Button
              type="button"
              onClick={() =>
                append({
                  productId: '',
                  productName: '',
                  price: '',
                  quantity: '1',
                })
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
