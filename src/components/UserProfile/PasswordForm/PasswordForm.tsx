import { AccountInput } from '../AccountInput/AccountInput';

type PasswordFormProps = {
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
  onOldPasswordChange: (value: string) => void;
  onNewPasswordChange: (value: string) => void;
  onRepeatPasswordChange: (value: string) => void;
};

export function PasswordForm({
  oldPassword,
  newPassword,
  repeatPassword,
  onOldPasswordChange,
  onNewPasswordChange,
  onRepeatPasswordChange,
}: PasswordFormProps) {
  return (
    <section className="mt-10">
      <h2 className="mt-0 mb-6 text-[20px] font-semibold text-[rgb(var(--color-neutral-900))]">
        Password
      </h2>

      <div className="space-y-6">
        <AccountInput
          label="Old password"
          type="password"
          placeholder="Old password"
          value={oldPassword}
          onChange={onOldPasswordChange}
          showToggle
        />

        <AccountInput
          label="New password"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={onNewPasswordChange}
          showToggle
        />

        <AccountInput
          label="Repeat new password"
          type="password"
          placeholder="Repeat new password"
          value={repeatPassword}
          onChange={onRepeatPasswordChange}
        />
      </div>
    </section>
  );
}
