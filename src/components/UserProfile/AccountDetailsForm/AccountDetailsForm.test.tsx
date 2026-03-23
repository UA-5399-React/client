import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccountDetailsForm } from './AccountDetailsForm';

vi.mock('../AccountInput/AccountInput', () => ({
  AccountInput: ({
    label,
    value,
    onChange,
    disabled,
    placeholder,
    type,
  }: {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    disabled?: boolean;
    placeholder?: string;
    type?: string;
  }) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        type={type ?? 'text'}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
}));

describe('AccountDetailsForm', () => {
  const mockUser = {
    email: 'test@example.com',
  };

  it('renders heading and all account fields', () => {
    render(
      <AccountDetailsForm
        user={mockUser as never}
        firstName="Anna"
        lastName="Smith"
        onFirstNameChange={vi.fn()}
        onLastNameChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Account Details')).toBeInTheDocument();
    expect(screen.getByLabelText('First name')).toBeInTheDocument();
    expect(screen.getByLabelText('Last name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
  });

  it('renders first name and last name values', () => {
    render(
      <AccountDetailsForm
        user={mockUser as never}
        firstName="Anna"
        lastName="Smith"
        onFirstNameChange={vi.fn()}
        onLastNameChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('First name')).toHaveValue('Anna');
    expect(screen.getByLabelText('Last name')).toHaveValue('Smith');
  });

  it('renders email from user and disables email input', () => {
    render(
      <AccountDetailsForm
        user={mockUser as never}
        firstName="Anna"
        lastName="Smith"
        onFirstNameChange={vi.fn()}
        onLastNameChange={vi.fn()}
      />,
    );

    const emailInput = screen.getByLabelText('Email');

    expect(emailInput).toHaveValue('test@example.com');
    expect(emailInput).toBeDisabled();
  });

  it('calls onFirstNameChange when first name changes', () => {
    const onFirstNameChange = vi.fn();

    render(
      <AccountDetailsForm
        user={mockUser as never}
        firstName="Anna"
        lastName="Smith"
        onFirstNameChange={onFirstNameChange}
        onLastNameChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('First name'), {
      target: { value: 'Maria' },
    });

    expect(onFirstNameChange).toHaveBeenCalledTimes(1);
    expect(onFirstNameChange).toHaveBeenCalledWith('Maria');
  });

  it('calls onLastNameChange when last name changes', () => {
    const onLastNameChange = vi.fn();

    render(
      <AccountDetailsForm
        user={mockUser as never}
        firstName="Anna"
        lastName="Smith"
        onFirstNameChange={vi.fn()}
        onLastNameChange={onLastNameChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Last name'), {
      target: { value: 'Brown' },
    });

    expect(onLastNameChange).toHaveBeenCalledTimes(1);
    expect(onLastNameChange).toHaveBeenCalledWith('Brown');
  });
});
