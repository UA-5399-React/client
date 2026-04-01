import { useEffect } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import clsx from 'clsx';
import {
  CheckCircle2,
  CreditCard,
  LoaderCircle,
  PackageCheck,
  Truck,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components';
import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import { paymentService } from '@/services';
import { useCartStore } from '@/store/useCartStore';
import { type CheckoutOrderSnapshot, PAYMENT_METHODS } from '@/types';
import { checkoutStorage } from '@/utils/checkoutStorage';

const formatCurrency = (value: number) => `$${value.toFixed(2)}`;

interface LocationState {
  orderSnapshot?: CheckoutOrderSnapshot;
  paymentStatus?: string;
}

export const OrderConfirmation = () => {
  const { isDark } = useTheme();
  const clearCart = useCartStore((state) => state.clearCart);
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const sessionId = searchParams.get('session_id');
  const storedSnapshot = checkoutStorage.read();
  const locationState = location.state as LocationState | null;
  const orderSnapshot = locationState?.orderSnapshot ?? storedSnapshot;
  const isCashOnDelivery =
    orderSnapshot?.paymentMethod === PAYMENT_METHODS.CASH_ON_DELIVERY;

  const sessionQuery = useQuery({
    queryKey: ['checkout-session-status', sessionId],
    queryFn: () => paymentService.getSessionStatus(sessionId!),
    enabled: Boolean(sessionId),
    retry: false,
  });

  const isStripeStatusPending =
    Boolean(sessionId) && sessionQuery.status === 'pending';
  const isStripeSuccess =
    Boolean(sessionId) &&
    sessionQuery.data?.status === 'complete' &&
    sessionQuery.data?.paymentStatus === 'paid';
  const isCodSuccess =
    !sessionId &&
    isCashOnDelivery &&
    (locationState?.paymentStatus === 'pending' || Boolean(orderSnapshot));
  const isSuccess = isStripeSuccess || isCodSuccess;

  const title = isStripeStatusPending
    ? 'Checking your payment status...'
    : isSuccess
      ? 'Order confirmed'
      : 'We could not confirm this order';

  const description = isStripeStatusPending
    ? 'Please wait while we verify the checkout session.'
    : isSuccess
      ? 'Your checkout has been completed successfully.'
      : 'The payment session is incomplete or unavailable. You can return to checkout and try again.';

  useEffect(() => {
    if (isSuccess) {
      clearCart();
    }
  }, [clearCart, isSuccess]);

  return (
    <div
      className={clsx(
        'px-4 py-12 md:px-8 md:py-20',
        isDark ? 'bg-black' : 'bg-white',
      )}
    >
      <div className="mx-auto max-w-3xl">
        <div
          className={clsx(
            'rounded-2xl border px-6 py-8 md:px-10 md:py-12',
            isDark
              ? 'border-gray-700 bg-[#111111] text-white'
              : 'border-[#E8ECEF] bg-white text-[#141718]',
          )}
        >
          <div className="flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-3">
              {isStripeStatusPending ? (
                <LoaderCircle className="h-10 w-10 animate-spin text-[#6C7275]" />
              ) : isSuccess ? (
                <CheckCircle2 className="text-primary h-10 w-10" />
              ) : (
                <XCircle className="h-10 w-10 text-red-500" />
              )}
              <div>
                <h1 className="text-[32px] leading-[38px] font-medium">
                  {title}
                </h1>
                <p
                  className={clsx(
                    'mt-2 text-sm md:text-base',
                    isDark ? 'text-gray-400' : 'text-[#6C7275]',
                  )}
                >
                  {description}
                </p>
              </div>
            </div>
            {orderSnapshot?.orderId && (
              <div
                className={clsx(
                  'rounded-full px-4 py-2 text-sm font-semibold',
                  isDark
                    ? 'bg-black text-gray-300'
                    : 'bg-[#F3F5F7] text-[#141718]',
                )}
              >
                {orderSnapshot.orderId}
              </div>
            )}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <InfoCard
              isDark={isDark}
              icon={<PackageCheck className="h-5 w-5" />}
              label="Items"
              value={String(orderSnapshot?.items.length ?? 0)}
            />
            <InfoCard
              isDark={isDark}
              icon={<Truck className="h-5 w-5" />}
              label="Payment"
              value={
                isCashOnDelivery
                  ? 'Cash on delivery'
                  : isStripeStatusPending
                    ? 'Checking status...'
                    : (sessionQuery.data?.paymentStatus ?? 'Card payment')
              }
            />
            <InfoCard
              isDark={isDark}
              icon={<CreditCard className="h-5 w-5" />}
              label="Total"
              value={
                orderSnapshot
                  ? formatCurrency(orderSnapshot.totalPrice)
                  : 'Unavailable'
              }
            />
          </div>

          {orderSnapshot && (
            <div className="mt-8">
              <h2 className="text-xl font-medium">Order details</h2>
              <div
                className={clsx(
                  'mt-4 rounded-xl border',
                  isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
                )}
              >
                {orderSnapshot.items.map((item, index) => (
                  <div
                    key={`${item.product}-${index}`}
                    className={clsx(
                      'flex items-center justify-between gap-4 px-4 py-4',
                      index !== orderSnapshot.items.length - 1 &&
                        (isDark
                          ? 'border-b border-gray-700'
                          : 'border-b border-[#E8ECEF]'),
                    )}
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.title}
                          className="h-14 w-12 object-cover"
                        />
                      ) : (
                        <div
                          className={clsx(
                            'flex h-14 w-12 items-center justify-center',
                            isDark ? 'bg-black' : 'bg-[#F3F5F7]',
                          )}
                        >
                          <span className="text-[10px] text-gray-400">
                            No image
                          </span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">
                          {item.title}
                        </p>
                        <p
                          className={clsx(
                            'text-xs',
                            isDark ? 'text-gray-400' : 'text-[#6C7275]',
                          )}
                        >
                          Qty: {item.amount}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold">
                      {formatCurrency(item.unitPrice * item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link to={ROUTES.SHOP} className="sm:flex-1">
              <Button
                className={clsx(
                  'h-12 w-full rounded-[8px] border-none text-base font-medium shadow-none',
                  isDark
                    ? 'bg-white text-[#141718] hover:bg-gray-200'
                    : 'bg-[#141718] text-white hover:bg-black',
                )}
              >
                Continue shopping
              </Button>
            </Link>
            {!isStripeStatusPending && !isSuccess && (
              <Link to={ROUTES.CHECKOUT} className="sm:flex-1">
                <Button
                  className={clsx(
                    'h-12 w-full rounded-[8px] text-base font-medium shadow-none',
                    isDark
                      ? 'border border-gray-700 bg-transparent text-white hover:bg-[#1A1A1A]'
                      : 'border border-[#141718] bg-transparent text-[#141718] hover:bg-[#F3F5F7]',
                  )}
                >
                  Back to checkout
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({
  isDark,
  icon,
  label,
  value,
}: {
  isDark: boolean;
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div
    className={clsx(
      'rounded-xl border px-4 py-4',
      isDark ? 'border-gray-700 bg-black' : 'border-[#E8ECEF] bg-[#F9FAFB]',
    )}
  >
    <div
      className={clsx(
        'flex items-center gap-2 text-sm',
        isDark ? 'text-gray-400' : 'text-[#6C7275]',
      )}
    >
      {icon}
      {label}
    </div>
    <div className="mt-3 text-lg font-semibold">{value}</div>
  </div>
);
