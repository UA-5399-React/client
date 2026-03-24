import { type FieldErrors, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { PasswordForm } from './PasswordForm';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

function renderComponent({
  defaultValues,
  errors,
}: {
  defaultValues?: Partial<ProfileFormValues>;
  errors?: FieldErrors<ProfileFormValues>;
} = {}) {
  function TestWrapper() {
    const { control } = useForm<ProfileFormValues>({
      defaultValues: {
        firstName: '',
        lastName: '',
        oldPassword: '',
        newPassword: '',
        repeatPassword: '',
        ...defaultValues,
      },
    });

    return <PasswordForm control={control} errors={errors ?? {}} />;
  }

  return render(<TestWrapper />);
}

describe('PasswordForm', () => {
  it('renders heading and password inputs', () => {
    renderComponent();

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Old password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Repeat new password'),
    ).toBeInTheDocument();
  });

  it('renders default input values', () => {
    renderComponent({
      defaultValues: {
        oldPassword: 'old-pass',
        newPassword: 'new-pass-123',
        repeatPassword: 'new-pass-123',
      },
    });

    expect(screen.getByDisplayValue('old-pass')).toBeInTheDocument();
    const inputs = screen.getAllByDisplayValue('new-pass-123');
    expect(inputs).toHaveLength(2);

    const repeatedPasswordInputs = screen.getAllByDisplayValue('new-pass-123');
    expect(repeatedPasswordInputs).toHaveLength(2);
  });

  it('allows changing old, new and repeat password inputs', async () => {
    const user = userEvent.setup();

    renderComponent({
      defaultValues: {
        oldPassword: 'old-pass',
        newPassword: 'new-pass-123',
        repeatPassword: 'new-pass-123',
      },
    });

    const oldPasswordInput = screen.getByPlaceholderText('Old password');
    const newPasswordInput = screen.getByPlaceholderText('New password');
    const repeatPasswordInput = screen.getByPlaceholderText(
      'Repeat new password',
    );

    await user.clear(oldPasswordInput);
    await user.type(oldPasswordInput, 'updated-old');

    await user.clear(newPasswordInput);
    await user.type(newPasswordInput, 'updated-new-123');

    await user.clear(repeatPasswordInput);
    await user.type(repeatPasswordInput, 'updated-new-123');

    expect(oldPasswordInput).toHaveValue('updated-old');
    expect(newPasswordInput).toHaveValue('updated-new-123');
    expect(repeatPasswordInput).toHaveValue('updated-new-123');
  });

  it('renders old password error message', () => {
    renderComponent({
      errors: {
        oldPassword: {
          type: 'required',
          message: 'Old password is required',
        },
      },
    });

    expect(screen.getByText('Old password is required')).toBeInTheDocument();
  });

  it('renders new password error message', () => {
    renderComponent({
      errors: {
        newPassword: {
          type: 'minLength',
          message: 'New password must be at least 6 characters',
        },
      },
    });

    expect(
      screen.getByText('New password must be at least 6 characters'),
    ).toBeInTheDocument();
  });

  it('renders repeat password error message', () => {
    renderComponent({
      errors: {
        repeatPassword: {
          type: 'validate',
          message: 'Passwords do not match',
        },
      },
    });

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });
});
