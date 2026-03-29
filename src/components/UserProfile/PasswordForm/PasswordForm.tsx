import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import type { ProfileFormValues } from '@/schemas/profile.schema';

import { AccountInput } from '../AccountInput/AccountInput';

type PasswordFormProps = {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
};

export function PasswordForm({ control, errors }: PasswordFormProps) {
  return (
    <section className="mt-10">
      <h2 className="text-text mt-0 mb-6 text-[20px] font-semibold">
        Password
      </h2>

      <div className="space-y-6">
        <Controller
          name="oldPassword"
          control={control}
          render={({ field }) => (
            <AccountInput
              label="Old password"
              type="password"
              placeholder="Old password"
              value={field.value ?? ''}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.oldPassword?.message ? (
          <p className="text-sm text-red-600">
            {String(errors.oldPassword.message)}
          </p>
        ) : null}

        <Controller
          name="newPassword"
          control={control}
          render={({ field }) => (
            <AccountInput
              label="New password"
              type="password"
              placeholder="New password"
              value={field.value ?? ''}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.newPassword?.message ? (
          <p className="text-sm text-red-600">
            {String(errors.newPassword.message)}
          </p>
        ) : null}

        <Controller
          name="repeatPassword"
          control={control}
          render={({ field }) => (
            <AccountInput
              label="Repeat new password"
              type="password"
              placeholder="Repeat new password"
              value={field.value ?? ''}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.repeatPassword?.message ? (
          <p className="text-sm text-red-600">
            {String(errors.repeatPassword.message)}
          </p>
        ) : null}
      </div>
    </section>
  );
}
