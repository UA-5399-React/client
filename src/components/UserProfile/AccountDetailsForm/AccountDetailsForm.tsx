import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { ProfileFormValues } from '@/schemas/profile.schema';
import type { User } from '@/types/user';

import { AccountInput } from '../AccountInput/AccountInput';

type AccountDetailsFormProps = {
  user: User;
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
};

export function AccountDetailsForm({
  user,
  control,
  errors,
}: AccountDetailsFormProps) {
  return (
    <section>
      <h2 className="mt-0 mb-6 text-[20px] font-semibold text-[rgb(var(--color-neutral-900))]">
        Account Details
      </h2>

      <div className="space-y-6">
        <Controller
          name="firstName"
          control={control}
          render={({ field }) => (
            <AccountInput
              label="First name"
              placeholder="First name"
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        />
        {errors.firstName?.message ? (
          <p className="text-sm text-[rgb(var(--color-red-600))]">
            {String(errors.firstName.message)}
          </p>
        ) : null}

        <Controller
          name="lastName"
          control={control}
          render={({ field }) => (
            <AccountInput
              label="Last name"
              placeholder="Last name"
              value={field.value ?? ''}
              onChange={field.onChange}
            />
          )}
        />
        {errors.lastName?.message ? (
          <p className="text-sm text-[rgb(var(--color-red-600))]">
            {String(errors.lastName.message)}
          </p>
        ) : null}

        <AccountInput
          label="Email"
          type="email"
          value={user.email ?? ''}
          disabled
        />
      </div>
    </section>
  );
}
