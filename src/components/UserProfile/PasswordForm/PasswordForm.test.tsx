import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { PasswordForm } from './PasswordForm';

vi.mock('../AccountInput/AccountInput', () => ({
  AccountInput: ({
    label,
    value,
    onChange,
    placeholder,
    type,
    showToggle,
  }: {
    label: string;
    value: string;
    onChange?: (value: string) => void;
    placeholder?: string;
    type?: string;
    showToggle?: boolean;
  }) => (
    <div>
      <label>{label}</label>
      <input
        aria-label={label}
        value={value}
        placeholder={placeholder}
        type={type ?? 'text'}
        data-show-toggle={showToggle ? 'true' : 'false'}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  ),
}));

describe('PasswordForm', () => {
  it('renders heading and all password fields', () => {
    render(
      <PasswordForm
        oldPassword="old123"
        newPassword="new123"
        repeatPassword="new123"
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

    expect(screen.getByText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Old password')).toBeInTheDocument();
    expect(screen.getByLabelText('New password')).toBeInTheDocument();
    expect(screen.getByLabelText('Repeat new password')).toBeInTheDocument();
  });

  it('renders passed values', () => {
    render(
      <PasswordForm
        oldPassword="old123"
        newPassword="new456"
        repeatPassword="new456"
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Old password')).toHaveValue('old123');
    expect(screen.getByLabelText('New password')).toHaveValue('new456');
    expect(screen.getByLabelText('Repeat new password')).toHaveValue('new456');
  });

  it('passes password type to all inputs', () => {
    render(
      <PasswordForm
        oldPassword=""
        newPassword=""
        repeatPassword=""
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

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

  it('enables toggle only for old and new password fields', () => {
    render(
      <PasswordForm
        oldPassword=""
        newPassword=""
        repeatPassword=""
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

    expect(screen.getByLabelText('Old password')).toHaveAttribute(
      'data-show-toggle',
      'true',
    );
    expect(screen.getByLabelText('New password')).toHaveAttribute(
      'data-show-toggle',
      'true',
    );
    expect(screen.getByLabelText('Repeat new password')).toHaveAttribute(
      'data-show-toggle',
      'false',
    );
  });

  it('calls onOldPasswordChange when old password changes', () => {
    const onOldPasswordChange = vi.fn();

    render(
      <PasswordForm
        oldPassword=""
        newPassword=""
        repeatPassword=""
        onOldPasswordChange={onOldPasswordChange}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('Old password'), {
      target: { value: 'old-pass' },
    });

    expect(onOldPasswordChange).toHaveBeenCalledTimes(1);
    expect(onOldPasswordChange).toHaveBeenCalledWith('old-pass');
  });

  it('calls onNewPasswordChange when new password changes', () => {
    const onNewPasswordChange = vi.fn();

    render(
      <PasswordForm
        oldPassword=""
        newPassword=""
        repeatPassword=""
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={onNewPasswordChange}
        onRepeatPasswordChange={vi.fn()}
      />,
    );

    fireEvent.change(screen.getByLabelText('New password'), {
      target: { value: 'new-pass' },
    });

    expect(onNewPasswordChange).toHaveBeenCalledTimes(1);
    expect(onNewPasswordChange).toHaveBeenCalledWith('new-pass');
  });

  it('calls onRepeatPasswordChange when repeat password changes', () => {
    const onRepeatPasswordChange = vi.fn();

    render(
      <PasswordForm
        oldPassword=""
        newPassword=""
        repeatPassword=""
        onOldPasswordChange={vi.fn()}
        onNewPasswordChange={vi.fn()}
        onRepeatPasswordChange={onRepeatPasswordChange}
      />,
    );

    fireEvent.change(screen.getByLabelText('Repeat new password'), {
      target: { value: 'repeat-pass' },
    });

    expect(onRepeatPasswordChange).toHaveBeenCalledTimes(1);
    expect(onRepeatPasswordChange).toHaveBeenCalledWith('repeat-pass');
  });
});
