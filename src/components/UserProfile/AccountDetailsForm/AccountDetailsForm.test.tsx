import { type FieldErrors, useForm } from 'react-hook-form';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import type { User } from '@/types/user';

import { AccountDetailsForm } from './AccountDetailsForm';

type ProfileFormValues = {
  firstName: string;
  lastName: string;
  oldPassword: string;
  newPassword: string;
  repeatPassword: string;
};

const mockUser: User = {
  id: '1',
  email: 'test@example.com',
  firstName: 'Anna',
  lastName: 'Smith',
  role: 'user',
  isActive: true,
  isEmailConfirmed: true,
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

    return (
      <AccountDetailsForm
        user={mockUser}
        control={control}
        errors={errors ?? {}}
      />
    );
  }

  return render(<TestWrapper />);
}

describe('AccountDetailsForm', () => {
  it('renders heading and inputs', () => {
    renderComponent({
      defaultValues: {
        firstName: 'Anna',
        lastName: 'Smith',
      },
    });

    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Last name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('test@example.com')).toBeInTheDocument();
  });

  it('renders default first and last name values', () => {
    renderComponent({
      defaultValues: {
        firstName: 'Anna',
        lastName: 'Smith',
      },
    });

    expect(screen.getByDisplayValue('Anna')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
  });

  it('allows changing first and last name', async () => {
    const user = userEvent.setup();

    renderComponent({
      defaultValues: {
        firstName: 'Anna',
        lastName: 'Smith',
      },
    });

    const firstNameInput = screen.getByPlaceholderText('First name');
    const lastNameInput = screen.getByPlaceholderText('Last name');

    await user.clear(firstNameInput);
    await user.type(firstNameInput, 'Kate');

    await user.clear(lastNameInput);
    await user.type(lastNameInput, 'Brown');

    expect(firstNameInput).toHaveValue('Kate');
    expect(lastNameInput).toHaveValue('Brown');
  });

  it('renders disabled email input', () => {
    renderComponent();

    expect(screen.getByDisplayValue('test@example.com')).toBeDisabled();
  });

  it('renders first name error message', () => {
    renderComponent({
      errors: {
        firstName: {
          type: 'required',
          message: 'First name is required',
        },
      },
    });

    expect(screen.getByText('First name is required')).toBeInTheDocument();
  });

  it('renders last name error message', () => {
    renderComponent({
      errors: {
        lastName: {
          type: 'required',
          message: 'Last name is required',
        },
      },
    });

    expect(screen.getByText('Last name is required')).toBeInTheDocument();
  });
});
