import { type FieldErrors, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { ProfileFormValues } from '@/schemas/profile.schema';
import type { User } from '@/types/user';

import { AccountDetailsForm } from './AccountDetailsForm';

type TestWrapperProps = {
  user: User;
  errors?: FieldErrors<ProfileFormValues>;
  defaultValues?: Partial<ProfileFormValues>;
};

function TestWrapper({ user, errors, defaultValues = {} }: TestWrapperProps) {
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

  return (
    <AccountDetailsForm user={user} control={control} errors={errors ?? {}} />
  );
}

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Anna',
  lastName: 'Smith',
  role: 'user',
  isActive: true,
  isEmailConfirmed: true,
};

describe('AccountDetailsForm', () => {
  it('renders section title and all inputs', () => {
    render(<TestWrapper user={mockUser} />);

    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders default first name and last name values from form', () => {
    render(
      <TestWrapper
        user={mockUser}
        defaultValues={{
          firstName: 'Tetiana',
          lastName: 'Tkachenko',
        }}
      />,
    );

    expect(screen.getByLabelText('First name')).toHaveValue('Tetiana');
    expect(screen.getByLabelText('Last name')).toHaveValue('Tkachenko');
  });

  it('renders disabled email input with user email', () => {
    render(<TestWrapper user={mockUser} />);

    const emailInput = screen.getByLabelText('Email');

    expect(emailInput).toHaveValue('test@example.com');
    expect(emailInput).toBeDisabled();
  });

  it('renders empty email value when user email is missing', () => {
    render(
      <TestWrapper
        user={{
          ...mockUser,
          email: '',
        }}
      />,
    );

    expect(screen.getByLabelText('Email')).toHaveValue('');
  });

  it('allows typing into first name and last name fields', async () => {
    const user = userEvent.setup();

    render(<TestWrapper user={mockUser} />);

    const firstNameInput = screen.getByLabelText('First name');
    const lastNameInput = screen.getByLabelText('Last name');

    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Olena');

    await user.clear(lastNameInput);
    await user.type(lastNameInput, 'Ivanenko');

    expect(firstNameInput).toHaveValue('Olena');
    expect(lastNameInput).toHaveValue('Ivanenko');
  });

  it('renders first name error message', () => {
    render(
      <TestWrapper
        user={mockUser}
        errors={{
          firstName: {
            type: 'manual',
            message: 'First name is required',
          },
        }}
      />,
    );

    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });

  it('renders last name error message', () => {
    render(
      <TestWrapper
        user={mockUser}
        errors={{
          lastName: {
            type: 'manual',
            message: 'Last name is required',
          },
        }}
      />,
    );

    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });

  it('renders both error messages when both fields have errors', () => {
    render(
      <TestWrapper
        user={mockUser}
        errors={{
          firstName: {
            type: 'manual',
            message: 'First name is required',
          },
          lastName: {
            type: 'manual',
            message: 'Last name is required',
          },
        }}
      />,
    );

    expect(screen.getByText('First name is required')).toBeInTheDocument();
    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });

  it('does not render error messages when there are no errors', () => {
    render(<TestWrapper user={mockUser} />);

    expect(
      screen.queryByText('First name is required'),
    ).not.toBeInTheDocument();
    expect(screen.queryByText('Last name is required')).not.toBeInTheDocument();
  });
});
