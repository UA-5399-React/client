import type { User } from '@/types/user';

import { AccountInput } from '../AccountInput/AccountInput';

type AccountDetailsFormProps = {
  user: User;
  firstName: string;
  lastName: string;
  onFirstNameChange: (value: string) => void;
  onLastNameChange: (value: string) => void;
};

export function AccountDetailsForm({
  user,
  firstName,
  lastName,
  onFirstNameChange,
  onLastNameChange,
}: AccountDetailsFormProps) {
  return (
    <section>
      <h2 className="mt-0 mb-6 text-[20px] font-semibold text-[rgb(var(--color-neutral-900))]">
        Account Details
      </h2>

      <div className="space-y-6">
        <AccountInput
          label="First name"
          placeholder="First name"
          value={firstName}
          onChange={onFirstNameChange}
        />

        <AccountInput
          label="Last name"
          placeholder="Last name"
          value={lastName}
          onChange={onLastNameChange}
        />

        <AccountInput label="Email" type="email" value={user.email} disabled />
      </div>
    </section>
  );
}
