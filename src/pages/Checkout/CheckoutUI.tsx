import { type ReactNode } from 'react';
import { type UseFormRegisterReturn } from 'react-hook-form';
import clsx from 'clsx';
import { LockKeyhole } from 'lucide-react';

import type { CheckoutFormValues } from './checkout.helpers';
import { fieldLabelClassName } from './checkout.helpers';

export const CheckoutSection = ({
  title,
  isDark,
  className,
  children,
}: {
  title: string;
  isDark: boolean;
  className?: string;
  children: ReactNode;
}) => (
  <section
    className={clsx(
      'overflow-visible rounded-[4px] border px-[15px] pt-[23px] pb-6',
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

export const Field = ({
  label,
  error,
  isDark,
  children,
}: {
  label: string;
  error?: string;
  isDark: boolean;
  children: ReactNode;
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

export const PaymentOption = ({
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
  icon?: ReactNode;
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

export const StripeInfoPanel = ({ isDark }: { isDark: boolean }) => (
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
