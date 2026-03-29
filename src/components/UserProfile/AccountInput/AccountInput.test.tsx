import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AccountInput } from './AccountInput';

describe('AccountInput', () => {
  it('renders label, placeholder and value', () => {
    render(
      <AccountInput
        label="First name"
        placeholder="Enter first name"
        value="Anna"
      />,
    );

    expect(screen.getByText('First name')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter first name')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Anna')).toBeInTheDocument();
  });

  it('renders text input by default', () => {
    render(<AccountInput label="Name" value="Test" />);

    const input = screen.getByDisplayValue('Test');
    expect(input).toHaveAttribute('type', 'text');
  });

  it('calls onChange with new value', () => {
    const onChange = vi.fn();

    render(<AccountInput label="Last name" value="" onChange={onChange} />);

    const input = screen.getByRole('textbox');

    fireEvent.change(input, { target: { value: 'Smith' } });

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('Smith');
  });

  it('renders disabled input when disabled=true', () => {
    render(
      <AccountInput
        label="Email"
        type="email"
        value="test@example.com"
        disabled
      />,
    );

    const input = screen.getByDisplayValue('test@example.com');
    expect(input).toBeDisabled();
  });

  it('does not render toggle button for non-password input', () => {
    render(
      <AccountInput
        label="Email"
        type="email"
        value="test@example.com"
        showToggle
      />,
    );

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('does not render toggle button for password input when showToggle=false', () => {
    render(<AccountInput label="Password" type="password" value="123456" />);

    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders toggle button for password input when showToggle=true', () => {
    render(
      <AccountInput
        label="Password"
        type="password"
        value="123456"
        showToggle
      />,
    );

    expect(screen.getByRole('button')).toBeInTheDocument();

    const input = screen.getByDisplayValue('123456');
    expect(input).toHaveAttribute('type', 'password');
  });

  it('toggles password visibility on button click', () => {
    render(
      <AccountInput
        label="Password"
        type="password"
        value="123456"
        showToggle
      />,
    );

    const input = screen.getByDisplayValue('123456');
    const button = screen.getByRole('button');

    expect(input).toHaveAttribute('type', 'password');

    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'text');

    fireEvent.click(button);
    expect(input).toHaveAttribute('type', 'password');
  });

  it('keeps password type when showToggle is false', () => {
    render(
      <AccountInput
        label="Password"
        type="password"
        value="123456"
        showToggle={false}
      />,
    );

    const input = screen.getByDisplayValue('123456');
    expect(input).toHaveAttribute('type', 'password');
  });
});
