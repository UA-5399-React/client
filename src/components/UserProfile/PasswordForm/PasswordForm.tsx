import type { Control, FieldErrors } from 'react-hook-form';
import { Controller } from 'react-hook-form';

import { AccountInput } from '../AccountInput/AccountInput';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

type PasswordFormProps = {
  control: Control<ProfileFormValues>;
  errors: FieldErrors<ProfileFormValues>;
};

export function PasswordForm({ control, errors }: PasswordFormProps) {
  return (
    <section className="mt-10">
      <h2 className="mt-0 mb-6 text-[20px] font-semibold text-[rgb(var(--color-neutral-900))]">
        Password
      </h2>

      <div className="space-y-6">
        <Controller
          name="oldPassword"
          control={control}
          rules={{
            validate: (value, formValues) => {
              const hasAnyPasswordValue =
                formValues.oldPassword ||
                formValues.newPassword ||
                formValues.repeatPassword;

              if (!hasAnyPasswordValue) return true;
              if (!value) return 'Old password is required';

              return true;
            },
          }}
          render={({ field }) => (
            <AccountInput
              label="Old password"
              type="password"
              placeholder="Old password"
              value={field.value}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.oldPassword ? (
          <p className="text-sm text-[rgb(var(--color-red-600))]">
            {errors.oldPassword.message}
          </p>
        ) : null}

        <Controller
          name="newPassword"
          control={control}
          rules={{
            validate: (value, formValues) => {
              const hasAnyPasswordValue =
                formValues.oldPassword ||
                formValues.newPassword ||
                formValues.repeatPassword;

              if (!hasAnyPasswordValue) return true;
              if (!value) return 'New password is required';
              if (value.length < 6)
                return 'New password must be at least 6 characters';

              return true;
            },
          }}
          render={({ field }) => (
            <AccountInput
              label="New password"
              type="password"
              placeholder="New password"
              value={field.value}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.newPassword ? (
          <p className="text-sm text-[rgb(var(--color-red-600))]">
            {errors.newPassword.message}
          </p>
        ) : null}

        <Controller
          name="repeatPassword"
          control={control}
          rules={{
            validate: (value, formValues) => {
              const hasAnyPasswordValue =
                formValues.oldPassword ||
                formValues.newPassword ||
                formValues.repeatPassword;

              if (!hasAnyPasswordValue) return true;
              if (!value) return 'Repeat password is required';
              if (value !== formValues.newPassword)
                return 'Passwords do not match';

              return true;
            },
          }}
          render={({ field }) => (
            <AccountInput
              label="Repeat new password"
              type="password"
              placeholder="Repeat new password"
              value={field.value}
              onChange={field.onChange}
              showToggle
            />
          )}
        />
        {errors.repeatPassword ? (
          <p className="text-sm text-[rgb(var(--color-red-600))]">
            {errors.repeatPassword.message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
