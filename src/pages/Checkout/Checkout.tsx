import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, type UseFormRegisterReturn, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import {
  ArrowLeft,
  Check,
  ChevronDown,
  CreditCard,
  LockKeyhole,
  Minus,
  Plus,
  TicketPercent,
  X,
} from 'lucide-react';
import { z } from 'zod';

import { Button, TextArea } from '@/components';
import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { orderService, paymentService } from '@/services';
import { useCartStore } from '@/store/useCartStore';
import {
  type CheckoutOrderSnapshot,
  type CreateOrderPayload,
  PAYMENT_METHODS,
  SHIPPING_CARRIERS,
} from '@/types';
import { checkoutStorage } from '@/utils/checkoutStorage';
import { redirectToExternalUrl } from '@/utils/navigation';

const fieldLabelClassName =
  'text-[12px] font-bold uppercase tracking-[0.02em] text-gray-600';

const baseFieldClassName =
  'box-border h-10 w-full max-w-full rounded-md border px-[15px] text-sm outline-none transition-colors placeholder:text-gray-600';

const checkoutSchema = z.object({
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

type CheckoutFormValues = z.infer<typeof checkoutSchema>;
type CheckoutFieldName = keyof CheckoutFormValues;

const isMongoId = (value?: string) =>
  Boolean(value && /^[a-f\d]{24}$/i.test(value));

const checkoutFieldNames: CheckoutFieldName[] = [
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

const readControlValue = (
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

const getFieldClassName = (isDark: boolean, hasError = false) =>
  clsx(
    baseFieldClassName,
    isDark
      ? 'border-gray-700 bg-black text-white'
      : 'border-[#CBCBCB] bg-white text-[#141718]',
    hasError &&
      (isDark ? 'border-red-500 text-red-200' : 'border-red-500 text-red-600'),
  );

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

const carrierOptions = [
  { value: SHIPPING_CARRIERS.NOVA_POST, label: 'Нова Пошта' },
  { value: SHIPPING_CARRIERS.UKRPOSHTA, label: 'Укрпошта' },
  { value: SHIPPING_CARRIERS.MEEST, label: 'Meest' },
] as const;

export const Checkout = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { items, clearCart, removeItem, updateQuantity, getCartTotal } =
    useCartStore();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = getCartTotal();
  const total = subtotal;

  const {
    control,
    register,
    handleSubmit,
    clearErrors,
    getValues,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      carrier: SHIPPING_CARRIERS.NOVA_POST,
      city: '',
      branchNumber: '',
      paymentMethod: PAYMENT_METHODS.STRIPE,
      message: '',
    },
  });

  const paymentMethod = useWatch({
    control,
    name: 'paymentMethod',
  });

  useEffect(() => {
    const syncRestoredValues = () => {
      const form = formRef.current;

      if (!form) {
        return;
      }

      checkoutFieldNames.forEach((fieldName) => {
        const restoredValue = readControlValue(
          form.elements.namedItem(fieldName),
        );

        if (restoredValue === null || restoredValue === getValues(fieldName)) {
          return;
        }

        setValue(
          fieldName,
          restoredValue as CheckoutFormValues[typeof fieldName],
          {
            shouldDirty: restoredValue !== '',
            shouldTouch: false,
            shouldValidate: false,
          },
        );

        if (restoredValue.trim() !== '') {
          clearErrors(fieldName);
        }
      });
    };

    const syncOnPageShow = () => {
      window.requestAnimationFrame(syncRestoredValues);
    };

    syncOnPageShow();
    window.addEventListener('pageshow', syncOnPageShow);

    return () => {
      window.removeEventListener('pageshow', syncOnPageShow);
    };
  }, [clearErrors, getValues, setValue]);

  const checkoutItems = useMemo(
    () =>
      items.map((item) => ({
        productId: item.product._id ?? item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      })),
    [items],
  );

  const buildOrderSnapshot = (
    values: CheckoutFormValues,
    payload: Awaited<ReturnType<typeof orderService.createOrder>>,
  ): CheckoutOrderSnapshot => ({
    orderId: payload.orderId,
    amount: payload.amount,
    totalPrice: payload.totalPrice,
    paymentMethod: values.paymentMethod,
    items: payload.items,
    customerName: `${values.firstName} ${values.lastName}`.trim(),
  });

  const onSubmit = async (values: CheckoutFormValues) => {
    setSubmitError(null);

    if (items.length === 0) {
      setSubmitError(
        'Your cart is empty. Add products before placing an order.',
      );
      return;
    }

    const invalidItem = items.find((item) => !isMongoId(item.product._id));

    if (invalidItem) {
      setSubmitError(
        'Some cart items cannot be checked out because they are missing a valid product ID.',
      );
      return;
    }

    const payload: CreateOrderPayload = {
      items: items.map((item) => ({
        product: item.product._id!,
        amount: item.quantity,
      })),
      shippingAddress: {
        carrier: values.carrier,
        city: values.city,
        branchNumber: values.branchNumber,
      },
      user: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone,
      },
      paymentMethod: values.paymentMethod,
      message: values.message?.trim() || undefined,
    };

    try {
      const createdOrder = await orderService.createOrder(payload);
      const snapshot = buildOrderSnapshot(values, createdOrder);
      checkoutStorage.save(snapshot);

      if (values.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY) {
        clearCart();
        navigate(ROUTES.ORDER_CONFIRMATION, {
          state: {
            orderSnapshot: snapshot,
            paymentStatus: 'pending',
          },
        });
        return;
      }

      const { sessionUrl } = await paymentService.createCheckoutSession(
        checkoutItems,
        createdOrder.orderId,
      );

      redirectToExternalUrl(sessionUrl);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong while placing your order.';
      setSubmitError(message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center px-6 text-center">
        <h1
          className={clsx(
            'text-[40px] leading-[44px] font-medium tracking-[-0.4px]',
            isDark ? 'text-white' : 'text-[#141718]',
          )}
        >
          Check Out
        </h1>
        <p
          className={clsx(
            'mt-4 text-base',
            isDark ? 'text-gray-400' : 'text-gray-600',
          )}
        >
          Your cart is empty. Add products before continuing to checkout.
        </p>
        <Button onClick={() => navigate(ROUTES.SHOP)} className="mt-8 px-8">
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <div
      className={clsx('pt-4 pb-16 md:pt-10', isDark ? 'bg-black' : 'bg-white')}
    >
      <div className="mx-auto max-w-[1120px] px-4 md:px-8 lg:px-0">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className={clsx(
            'mb-7 flex items-center gap-1 text-sm font-medium md:hidden',
            isDark ? 'text-gray-400' : 'text-[#605F5F]',
          )}
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          back
        </button>

        <h1
          className={clsx(
            'text-center text-[40px] leading-[44px] font-medium tracking-[-0.4px] md:text-[54px] md:leading-[58px] md:tracking-[-1px]',
            isDark ? 'text-white' : 'text-[#141718]',
          )}
        >
          Check Out
        </h1>

        <DesktopProcess isDark={isDark} />
        <MobileProcess isDark={isDark} />

        <div className="mt-10 lg:grid lg:grid-cols-[minmax(0,643px)_376px] lg:items-start lg:justify-between lg:gap-[101px]">
          <form
            ref={formRef}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <CheckoutSection
              title="Contact Infomation"
              isDark={isDark}
              className="md:px-[23px] md:pt-[39px] md:pb-10"
            >
              <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] md:gap-x-6 md:gap-y-0">
                <Field
                  label="First Name *"
                  error={errors.firstName?.message}
                  isDark={isDark}
                >
                  <input
                    {...register('firstName')}
                    type="text"
                    name="firstName"
                    autoComplete="given-name"
                    placeholder="First name"
                    className={getFieldClassName(
                      isDark,
                      Boolean(errors.firstName),
                    )}
                  />
                </Field>
                <Field
                  label="Last Name *"
                  error={errors.lastName?.message}
                  isDark={isDark}
                >
                  <input
                    {...register('lastName')}
                    type="text"
                    name="lastName"
                    autoComplete="family-name"
                    placeholder="Last name"
                    className={getFieldClassName(
                      isDark,
                      Boolean(errors.lastName),
                    )}
                  />
                </Field>
              </div>

              <Field
                label="Phone Number *"
                error={errors.phone?.message}
                isDark={isDark}
              >
                <input
                  {...register('phone')}
                  type="tel"
                  name="phone"
                  autoComplete="tel"
                  placeholder="Phone number"
                  className={getFieldClassName(isDark, Boolean(errors.phone))}
                />
              </Field>

              <Field
                label="Email Address *"
                error={errors.email?.message}
                isDark={isDark}
              >
                <input
                  {...register('email')}
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="Email address"
                  className={getFieldClassName(isDark, Boolean(errors.email))}
                />
              </Field>
            </CheckoutSection>

            <CheckoutSection
              title="Shipping Address"
              isDark={isDark}
              className="md:px-[23px] md:pt-[39px] md:pb-10"
            >
              <Field
                label="Delivery *"
                error={errors.carrier?.message}
                isDark={isDark}
              >
                <div className="relative">
                  <select
                    {...register('carrier')}
                    name="carrier"
                    autoComplete="shipping country"
                    className={clsx(
                      getFieldClassName(isDark, Boolean(errors.carrier)),
                      'appearance-none pr-10',
                    )}
                  >
                    {carrierOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    className={clsx(
                      'pointer-events-none absolute top-1/2 right-4 h-4 w-4 -translate-y-1/2',
                      isDark ? 'text-gray-500' : 'text-[#6C7275]',
                    )}
                  />
                </div>
              </Field>

              <Field
                label="Town / City *"
                error={errors.city?.message}
                isDark={isDark}
              >
                <input
                  {...register('city')}
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  placeholder="Town / City"
                  className={getFieldClassName(isDark, Boolean(errors.city))}
                />
              </Field>

              <Field
                label="Department Code*"
                error={errors.branchNumber?.message}
                isDark={isDark}
              >
                <input
                  {...register('branchNumber')}
                  type="text"
                  name="branchNumber"
                  autoComplete="address-line2"
                  placeholder="Department code"
                  className={getFieldClassName(
                    isDark,
                    Boolean(errors.branchNumber),
                  )}
                />
              </Field>
            </CheckoutSection>

            <CheckoutSection
              title="Payment method"
              isDark={isDark}
              className="md:px-[23px] md:pt-[39px] md:pb-10"
            >
              <div
                className={clsx(
                  'space-y-6',
                  isDark ? 'border-gray-700' : 'border-[#6C7275]',
                )}
              >
                <div className="space-y-6 border-b pb-6">
                  <PaymentOption
                    label="Pay with card securely"
                    value={PAYMENT_METHODS.STRIPE}
                    selectedValue={paymentMethod}
                    isDark={isDark}
                    icon={<CreditCard className="h-4 w-4" />}
                    inputProps={register('paymentMethod')}
                  />

                  <PaymentOption
                    label="Cash on delivery"
                    value={PAYMENT_METHODS.CASH_ON_DELIVERY}
                    selectedValue={paymentMethod}
                    isDark={isDark}
                    inputProps={register('paymentMethod')}
                  />
                </div>

                {paymentMethod === PAYMENT_METHODS.STRIPE && (
                  <StripeInfoPanel isDark={isDark} />
                )}
              </div>
            </CheckoutSection>

            <CheckoutSection
              title="Additional information"
              isDark={isDark}
              className="hidden md:block md:px-[23px] md:pt-[23px] md:pb-10"
            >
              <Field label="Message" isDark={isDark}>
                <TextArea
                  {...register('message')}
                  name="message"
                  autoComplete="off"
                  placeholder="Your message"
                  textAreaClassName={clsx(
                    'box-border min-h-[140px] w-full max-w-full rounded-md px-[15px] py-3 text-sm',
                    isDark
                      ? 'border-gray-700 bg-black text-white'
                      : 'border-[#CBCBCB] bg-white text-[#141718]',
                  )}
                />
              </Field>
            </CheckoutSection>

            <div className="lg:hidden">
              <OrderSummary
                isDark={isDark}
                promoCode={promoCode}
                setPromoCode={setPromoCode}
                subtotal={subtotal}
                total={total}
                items={items}
                removeItem={removeItem}
                updateQuantity={updateQuantity}
              />
            </div>

            {submitError && (
              <p className="text-sm font-medium text-red-500">{submitError}</p>
            )}

            <Button
              type="submit"
              disabled={isSubmitting}
              className={clsx(
                'h-[52px] w-full rounded-[8px] border-none text-base font-medium shadow-none transition-colors hover:border-none md:max-w-[643px]',
                isDark
                  ? 'bg-white text-[#141718] hover:bg-gray-200'
                  : 'bg-[#141718] text-white hover:bg-black',
              )}
            >
              {isSubmitting
                ? paymentMethod === PAYMENT_METHODS.STRIPE
                  ? 'Continuing to Stripe...'
                  : 'Placing order...'
                : paymentMethod === PAYMENT_METHODS.STRIPE
                  ? 'Continue to Stripe'
                  : 'Place Order'}
            </Button>
          </form>

          <div className="hidden lg:block">
            <OrderSummary
              isDark={isDark}
              promoCode={promoCode}
              setPromoCode={setPromoCode}
              subtotal={subtotal}
              total={total}
              items={items}
              removeItem={removeItem}
              updateQuantity={updateQuantity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const DesktopProcess = ({ isDark }: { isDark: boolean }) => (
  <div className="mx-auto mt-10 hidden max-w-[832px] items-start justify-between md:flex">
    <ProcessStep
      isDark={isDark}
      title="Shopping cart"
      number="1"
      state="completed"
    />
    <ProcessStep
      isDark={isDark}
      title="Checkout details"
      number="2"
      state="current"
    />
    <ProcessStep
      isDark={isDark}
      title="Order complete"
      number="3"
      state="upcoming"
    />
  </div>
);

const MobileProcess = ({ isDark }: { isDark: boolean }) => (
  <div className="mt-6 flex overflow-hidden md:hidden">
    <div className="min-w-[256px]">
      <ProcessStep
        isDark={isDark}
        title="Checkout details"
        number="2"
        state="current"
      />
    </div>
    <div className="ml-8 min-w-[256px]">
      <ProcessStep
        isDark={isDark}
        title="Order complete"
        number="3"
        state="upcoming"
      />
    </div>
  </div>
);

const ProcessStep = ({
  title,
  number,
  state,
  isDark,
}: {
  title: string;
  number: string;
  state: 'completed' | 'current' | 'upcoming';
  isDark: boolean;
}) => {
  const containerClassName =
    state === 'completed'
      ? 'border-primary text-primary'
      : state === 'current'
        ? isDark
          ? 'border-white text-white'
          : 'border-[#141718] text-[#23262F]'
        : isDark
          ? 'border-gray-700 text-gray-500'
          : 'border-[#E8ECEF] text-[#B1B5C3]';

  const badgeClassName =
    state === 'completed'
      ? 'bg-primary text-white'
      : state === 'current'
        ? isDark
          ? 'bg-white text-[#141718]'
          : 'bg-[#23262F] text-white'
        : isDark
          ? 'bg-gray-700 text-white'
          : 'bg-[#B1B5C3] text-white';

  return (
    <div className={clsx('border-b-2 pb-6', containerClassName)}>
      <div className="flex items-center gap-4">
        <div
          className={clsx(
            'flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold',
            badgeClassName,
          )}
        >
          {state === 'completed' ? <Check className="h-5 w-5" /> : number}
        </div>
        <span className="text-base font-semibold">{title}</span>
      </div>
    </div>
  );
};

const CheckoutSection = ({
  title,
  isDark,
  className,
  children,
}: {
  title: string;
  isDark: boolean;
  className?: string;
  children: React.ReactNode;
}) => (
  <section
    className={clsx(
      'rounded-[4px] border px-[15px] pt-[23px] pb-6',
      isDark ? 'border-gray-700 bg-black' : 'border-[#6C7275] bg-white',
      className,
    )}
  >
    <h2
      className={clsx(
        'mb-6 text-base leading-[26px] font-semibold md:text-[20px] md:leading-[28px] md:font-medium',
        isDark ? 'text-white' : 'text-[#141718]',
      )}
    >
      {title}
    </h2>
    <div className="space-y-6">{children}</div>
  </section>
);

const Field = ({
  label,
  error,
  isDark,
  children,
}: {
  label: string;
  error?: string;
  isDark: boolean;
  children: React.ReactNode;
}) => (
  <div className="min-w-0 space-y-3">
    <label className={fieldLabelClassName}>{label}</label>
    {children}
    {error && (
      <p className={clsx('text-xs', isDark ? 'text-red-400' : 'text-red-500')}>
        {error}
      </p>
    )}
  </div>
);

const PaymentOption = ({
  label,
  value,
  selectedValue,
  isDark,
  icon,
  inputProps,
}: {
  label: string;
  value: CheckoutFormValues['paymentMethod'];
  selectedValue: CheckoutFormValues['paymentMethod'];
  isDark: boolean;
  icon?: React.ReactNode;
  inputProps: UseFormRegisterReturn<'paymentMethod'>;
}) => (
  <label
    className={clsx(
      'flex cursor-pointer items-center justify-between rounded-[4px] border px-[15px] py-[13px]',
      selectedValue === value
        ? isDark
          ? 'border-white bg-[#111111]'
          : 'border-[#141718] bg-[#F3F5F7]'
        : isDark
          ? 'border-gray-700 bg-black'
          : 'border-[#6C7275] bg-white',
    )}
  >
    <div className="flex items-center gap-3">
      <input
        {...inputProps}
        value={value}
        type="radio"
        className="h-[18px] w-[18px] accent-[#141718]"
      />
      <span
        className={clsx('text-base', isDark ? 'text-white' : 'text-[#141718]')}
      >
        {label}
      </span>
    </div>
    {icon && (
      <span className={clsx(isDark ? 'text-gray-400' : 'text-[#141718]')}>
        {icon}
      </span>
    )}
  </label>
);

const StripeInfoPanel = ({ isDark }: { isDark: boolean }) => (
  <div
    className={clsx(
      'rounded-[6px] border px-4 py-4 md:px-[15px]',
      isDark
        ? 'border-gray-700 bg-[#111111] text-white'
        : 'border-[#6C7275] bg-[#FEFEFE] text-[#141718]',
    )}
  >
    <div className="flex items-start gap-3">
      <span
        className={clsx(
          'mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
          isDark ? 'bg-black text-gray-300' : 'bg-[#F3F5F7] text-[#141718]',
        )}
      >
        <LockKeyhole className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-sm font-medium md:text-base">
          Card details are entered securely on Stripe.
        </p>
        <p
          className={clsx(
            'mt-1 text-sm leading-6',
            isDark ? 'text-gray-400' : 'text-[#6C7275]',
          )}
        >
          After you continue, Stripe will open in a secure checkout page where
          you can enter your card information once and complete the payment.
        </p>
      </div>
    </div>
  </div>
);

function OrderSummary({
  isDark,
  promoCode,
  setPromoCode,
  subtotal,
  total,
  items,
  removeItem,
  updateQuantity,
}: {
  isDark: boolean;
  promoCode: string;
  setPromoCode: (value: string) => void;
  subtotal: number;
  total: number;
  items: ReturnType<typeof useCartStore.getState>['items'];
  removeItem: ReturnType<typeof useCartStore.getState>['removeItem'];
  updateQuantity: ReturnType<typeof useCartStore.getState>['updateQuantity'];
}) {
  return (
    <aside
      className={clsx(
        'rounded-[6px] border px-[15px] py-[15px] md:px-[23px] md:py-[31px]',
        isDark ? 'border-gray-700 bg-black' : 'border-[#6C7275] bg-white',
      )}
    >
      <h2
        className={clsx(
          'text-[20px] leading-[28px] font-medium',
          isDark ? 'text-white' : 'text-[#121212]',
        )}
      >
        Order summary
      </h2>

      <div className="mt-6 space-y-6">
        {items.map((item) => {
          const productId = item.product.id || item.product._id!;
          const lineTotal = item.product.price * item.quantity;

          return (
            <div
              key={productId}
              className={clsx(
                'border-b pb-6',
                isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
              )}
            >
              <div className="flex gap-4">
                {item.product.imageUrl ? (
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="h-24 w-20 object-cover"
                  />
                ) : (
                  <div
                    className={clsx(
                      'flex h-24 w-20 items-center justify-center',
                      isDark ? 'bg-[#111111]' : 'bg-[#F3F5F7]',
                    )}
                  >
                    <span className="text-xs text-gray-400">No image</span>
                  </div>
                )}

                <div className="flex min-w-0 flex-1 justify-between gap-4">
                  <div className="min-w-0">
                    <p
                      className={clsx(
                        'text-sm leading-[22px] font-semibold',
                        isDark ? 'text-white' : 'text-[#141718]',
                      )}
                    >
                      {item.product.title}
                    </p>
                    {item.product.categories?.[0] && (
                      <p
                        className={clsx(
                          'mt-2 text-xs leading-5',
                          isDark ? 'text-gray-400' : 'text-[#6C7275]',
                        )}
                      >
                        {item.product.categories[0]}
                      </p>
                    )}

                    <div
                      className={clsx(
                        'mt-3 flex h-8 w-20 items-center rounded-[4px] border px-[7px]',
                        isDark ? 'border-gray-700' : 'border-[#6C7275]',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(productId, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                        className="flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 text-current disabled:opacity-40"
                        aria-label={`Decrease quantity for ${item.product.title}`}
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span
                        className={clsx(
                          'flex-1 text-center text-xs font-semibold',
                          isDark ? 'text-white' : 'text-[#121212]',
                        )}
                      >
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(productId, item.quantity + 1)
                        }
                        className="flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 text-current"
                        aria-label={`Increase quantity for ${item.product.title}`}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col items-end">
                    <p
                      className={clsx(
                        'text-sm leading-[22px] font-semibold',
                        isDark ? 'text-white' : 'text-[#121212]',
                      )}
                    >
                      {formatCurrency(lineTotal)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeItem(productId)}
                      className={clsx(
                        'mt-2 border-none bg-transparent p-0',
                        isDark ? 'text-gray-400' : 'text-[#141718]',
                      )}
                      aria-label={`Remove ${item.product.title}`}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <div className="flex gap-3">
          <input
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            type="text"
            name="promoCode"
            autoComplete="off"
            placeholder="Promo code"
            className={clsx(
              'box-border h-[52px] max-w-full flex-1 rounded-[6px] border px-[15px] text-base outline-none placeholder:text-[#605F5F]',
              isDark
                ? 'border-gray-700 bg-black text-white'
                : 'border-[#CBCBCB] bg-white text-[#141718]',
            )}
          />
          <Button
            type="button"
            onClick={() => setPromoCode('')}
            className={clsx(
              'h-[52px] rounded-[8px] border-none px-6 text-base font-medium shadow-none',
              isDark
                ? 'bg-white text-[#141718] hover:bg-gray-200'
                : 'bg-[#141718] text-white hover:bg-black',
            )}
          >
            Apply
          </Button>
        </div>

        <div className="space-y-4">
          <div
            className={clsx(
              'flex items-center justify-between border-b pb-4',
              isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
            )}
          >
            <div className="flex items-center gap-2">
              <TicketPercent className="h-4 w-4" />
              <span className={clsx(isDark ? 'text-white' : 'text-[#141718]')}>
                Promo
              </span>
            </div>
            <span className="text-[#38CB89]">Not applied</span>
          </div>

          <div
            className={clsx(
              'flex items-center justify-between border-b pb-4',
              isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
            )}
          >
            <span className={clsx(isDark ? 'text-white' : 'text-[#141718]')}>
              Shipping
            </span>
            <span
              className={clsx(
                'text-right',
                isDark ? 'text-gray-400' : 'text-[#6C7275]',
              )}
            >
              Carrier tariffs | Free
            </span>
          </div>

          <div>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p
                  className={clsx(
                    'text-[20px] leading-[28px] font-medium',
                    isDark ? 'text-white' : 'text-[#141718]',
                  )}
                >
                  Total <span className="align-top text-sm">*</span>
                </p>
                <p
                  className={clsx(
                    'mt-1 text-xs',
                    isDark ? 'text-gray-400' : 'text-[#6C7275]',
                  )}
                >
                  Final price may change depending on delivery cost.
                </p>
              </div>
              <p
                className={clsx(
                  'text-[20px] leading-[28px] font-medium',
                  isDark ? 'text-white' : 'text-[#141718]',
                )}
              >
                {formatCurrency(total || subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
