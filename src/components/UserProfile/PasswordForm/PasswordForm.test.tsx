import { type FieldErrors, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { ProfileFormValues } from '@/schemas/profile.schema';

import { PasswordForm } from './PasswordForm';

type TestWrapperProps = {
  errors?: FieldErrors<ProfileFormValues>;
  defaultValues?: Partial<ProfileFormValues>;
};

function TestWrapper({ errors, defaultValues = {} }: TestWrapperProps) {
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

describe('PasswordForm', () => {
  it('renders section title and all password inputs', () => {
    render(<TestWrapper />);

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Old password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Repeat new password')).toBeInTheDocument();
  });

  it('renders default password field values from form', () => {
    render(
      <TestWrapper
        defaultValues={{
          oldPassword: 'old-pass',
          newPassword: 'new-pass-123',
          repeatPassword: 'new-pass-123',
        }}
      />,
    );

    expect(screen.getByLabelText('Old password')).toHaveValue('old-pass');
    expect(screen.getByLabelText('New password')).toHaveValue('new-pass-123');
    expect(screen.getByLabelText('Repeat new password')).toHaveValue(
      'new-pass-123',
    );
  });

  it('allows typing into password fields', async () => {
    const user = userEvent.setup();

    render(<TestWrapper />);

    const oldPasswordInput = screen.getByLabelText('Old password');
    const newPasswordInput = screen.getByLabelText('New password');
    const repeatPasswordInput = screen.getByLabelText('Repeat new password');

    await user.type(oldPasswordInput, 'old123');
    await user.type(newPasswordInput, 'new123456');
    await user.type(repeatPasswordInput, 'new123456');

    expect(oldPasswordInput).toHaveValue('old123');
    expect(newPasswordInput).toHaveValue('new123456');
    expect(repeatPasswordInput).toHaveValue('new123456');
  });

  it('renders old password error message', () => {
    render(
      <TestWrapper
        errors={{
          oldPassword: {
            type: 'manual',
            message: 'Old password is required',
          },
        }}
      />,
    );

    expect(screen.getByText('Old password is required')).toBeInTheDocument();
  });

  it('renders new password error message', () => {
    render(
      <TestWrapper
        errors={{
          newPassword: {
            type: 'manual',
            message: 'New password must be at least 6 characters',
          },
        }}
      />,
    );

    expect(
      screen.getByText('New password must be at least 6 characters'),
    ).toBeInTheDocument();
  });

  it('renders repeat password error message', () => {
    render(
      <TestWrapper
        errors={{
          repeatPassword: {
            type: 'manual',
            message: 'Passwords do not match',
          },
        }}
      />,
    );

    expect(screen.getByText('Passwords do not match')).toBeInTheDocument();
  });

  it('renders all password error messages', () => {
    render(
      <TestWrapper
        errors={{
          oldPassword: {
            type: 'manual',
            message: 'Old password is required',
          },
          newPassword: {
            type: 'manual',
            message: 'New password is required',
          },
          repeatPassword: {
            type: 'manual',
            message: 'Repeat password is required',
          },
        }}
      />,
    );

    expect(screen.getByText('Old password is required')).toBeInTheDocument();
    expect(screen.getByText('New password is required')).toBeInTheDocument();
    expect(screen.getByText('Repeat password is required')).toBeInTheDocument();
  });

  it('does not render error messages when there are no errors', () => {
    render(<TestWrapper />);

    expect(
      screen.queryByText('Old password is required'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('New password is required'),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText('Repeat password is required'),
    ).not.toBeInTheDocument();
  });

  it('renders placeholders for all password fields', () => {
    render(<TestWrapper />);

    expect(screen.getByPlaceholderText('Old password')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('New password')).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText('Repeat new password'),
    ).toBeInTheDocument();
  });

  it('renders password inputs with hidden type by default', () => {
    render(<TestWrapper />);

    expect(screen.getByLabelText('Old password')).toHaveAttribute(
      'type',
      'password',
    );
    expect(screen.getByLabelText('New password')).toHaveAttribute(
      'type',
      'password',
    );
    expect(screen.getByLabelText('Repeat new password')).toHaveAttribute(
      'type',
      'password',
    );
  });
});
