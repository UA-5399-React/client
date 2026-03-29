import { type FieldErrors, type UseFormRegister } from 'react-hook-form';
import clsx from 'clsx';
import { ChevronDown, CreditCard } from 'lucide-react';

import { TextArea } from '@/components';
import { PAYMENT_METHODS } from '@/types';

import {
  carrierOptions,
  type CheckoutFormValues,
  getFieldClassName,
} from './checkout.helpers';
import {
  CheckoutSection,
  Field,
  PaymentOption,
  StripeInfoPanel,
} from './CheckoutUI';

interface CheckoutSectionProps {
  isDark: boolean;
  errors: FieldErrors<CheckoutFormValues>;
  register: UseFormRegister<CheckoutFormValues>;
}

export const ContactInformationSection = ({
  isDark,
  errors,
  register,
}: CheckoutSectionProps) => (
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
          className={getFieldClassName(isDark, Boolean(errors.firstName))}
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
          className={getFieldClassName(isDark, Boolean(errors.lastName))}
        />
      </Field>
    </div>

    <Field label="Phone Number *" error={errors.phone?.message} isDark={isDark}>
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
);

export const ShippingAddressSection = ({
  isDark,
  errors,
  register,
}: CheckoutSectionProps) => (
  <CheckoutSection
    title="Shipping Address"
    isDark={isDark}
    className="md:px-[23px] md:pt-[39px] md:pb-10"
  >
    <Field label="Delivery *" error={errors.carrier?.message} isDark={isDark}>
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

    <Field label="Town / City *" error={errors.city?.message} isDark={isDark}>
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
        className={getFieldClassName(isDark, Boolean(errors.branchNumber))}
      />
    </Field>
  </CheckoutSection>
);

interface PaymentMethodSectionProps extends CheckoutSectionProps {
  paymentMethod: CheckoutFormValues['paymentMethod'];
}

export const PaymentMethodSection = ({
  isDark,
  register,
  paymentMethod,
}: PaymentMethodSectionProps) => (
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
);

export const AdditionalInformationSection = ({
  isDark,
  register,
}: Pick<CheckoutSectionProps, 'isDark' | 'register'>) => (
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
);
