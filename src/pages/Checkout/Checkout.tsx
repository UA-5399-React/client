import { useEffect, useMemo, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ArrowLeft } from 'lucide-react';

import { Button } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useMe } from '@/hooks/useMe';
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

import {
  checkoutFieldNames,
  type CheckoutFormValues,
  checkoutSchema,
  isMongoId,
  readControlValue,
} from './checkout.helpers';
import { DesktopProcess, MobileProcess } from './CheckoutProcess';
import {
  AdditionalInformationSection,
  ContactInformationSection,
  PaymentMethodSection,
  ShippingAddressSection,
} from './CheckoutSections';
import { OrderSummary } from './OrderSummary';

const submitButtonLabels: Record<
  CheckoutFormValues['paymentMethod'],
  { idle: string; loading: string }
> = {
  [PAYMENT_METHODS.STRIPE]: {
    idle: 'Continue to Stripe',
    loading: 'Continuing to Stripe...',
  },
  [PAYMENT_METHODS.CASH_ON_DELIVERY]: {
    idle: 'Place Order',
    loading: 'Placing order...',
  },
};

export const Checkout = () => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const { isAuth } = useAuth();
  const { data: me } = useMe(isAuth);
  const { items, clearCart, removeItem, updateQuantity } = useCartStore();
  const formRef = useRef<HTMLFormElement | null>(null);

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');

  const subtotal = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    );
  }, [items]);
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

  const carrier = useWatch({ control, name: 'carrier' });

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

  useEffect(() => {
    if (!me) return;
    if (me.firstName) setValue('firstName', me.firstName);
    if (me.lastName) setValue('lastName', me.lastName);
    if (me.email) setValue('email', me.email);
    if (me.phone) setValue('phone', me.phone);
  }, [me, setValue]);
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

  const submitButtonText = isSubmitting
    ? submitButtonLabels[paymentMethod].loading
    : submitButtonLabels[paymentMethod].idle;

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
            <ContactInformationSection
              isDark={isDark}
              errors={errors}
              register={register}
            />

            <ShippingAddressSection
              isDark={isDark}
              errors={errors}
              register={register}
              control={control}
            />

            <PaymentMethodSection
              isDark={isDark}
              errors={errors}
              register={register}
              paymentMethod={paymentMethod}
            />

            <AdditionalInformationSection isDark={isDark} register={register} />

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
                carrier={carrier}
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
              {submitButtonText}
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
              carrier={carrier}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
