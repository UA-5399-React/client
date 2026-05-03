import * as React from 'react';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Input } from './Input';

describe('UI Component: Input', () => {
  it('should render correctly and accept user typing', async () => {
    const user = userEvent.setup();
    render(<Input placeholder="Enter your name" />);

    const input = screen.getByPlaceholderText('Enter your name');
    expect(input).toBeInTheDocument();

    await user.type(input, 'John Doe');
    expect(input).toHaveValue('John Doe');
  });

  it('should render a label and link it correctly to the input', () => {
    render(<Input label="Email Address" />);

    const input = screen.getByRole('textbox', { name: 'Email Address' });
    expect(input).toBeInTheDocument();
  });

  it('should display helper text and change its color based on state', () => {
    const { rerender } = render(
      <Input label="Username" helperText="Must be at least 5 characters" />,
    );

    const helperText = screen.getByText('Must be at least 5 characters');
    expect(helperText).toBeInTheDocument();

    expect(helperText).toHaveClass('text-green-700');

    rerender(
      <Input label="Username" helperText="Username taken" state="error" />,
    );

    const errorText = screen.getByText('Username taken');
    expect(errorText).toHaveClass('text-red-600');
  });

  it('should toggle password visibility when clicking the show/hide button', async () => {
    const user = userEvent.setup();
    render(<Input type="password" placeholder="Enter password" />);

    const input = screen.getByPlaceholderText('Enter password');
    expect(input).toHaveAttribute('type', 'password');

    const toggleButton = screen.getByRole('button', { name: 'Show password' });

    await user.click(toggleButton);
    expect(input).toHaveAttribute('type', 'text');

    expect(
      screen.getByRole('button', { name: 'Hide password' }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Hide password' }));
    expect(input).toHaveAttribute('type', 'password');
  });

  it('should render left icon and right element', () => {
    render(
      <Input
        placeholder="Search"
        leftIcon={<span data-testid="left-icon">🔍</span>}
        rightElement={<button data-testid="right-btn">Clear</button>}
      />,
    );

    expect(screen.getByTestId('left-icon')).toBeInTheDocument();
    expect(screen.getByTestId('right-btn')).toBeInTheDocument();
  });

  it('should be disabled when the disabled prop is passed', () => {
    render(<Input label="Blocked input" disabled />);

    const input = screen.getByRole('textbox', { name: 'Blocked input' });
    expect(input).toBeDisabled();
  });

  it('should apply custom class names to the wrapper and the input element', () => {
    const { container } = render(
      <Input
        placeholder="Custom"
        className="my-wrapper-class"
        inputClassName="my-input-class"
      />,
    );

    const input = screen.getByPlaceholderText('Custom');
    expect(input).toHaveClass('my-input-class');

    expect(container.firstChild).toHaveClass('my-wrapper-class');
  });

  it('should apply different variant and state styles correctly', () => {
    render(
      <Input placeholder="Styled input" variant="underlined" state="success" />,
    );

    const input = screen.getByPlaceholderText('Styled input');

    expect(input).toHaveClass('border-0 border-b');

    expect(input).toHaveClass('border-green-500');
  });

  it('should forward refs correctly', () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} placeholder="Ref input" />);

    expect(ref.current).toBeInstanceOf(HTMLInputElement);
    expect(ref.current?.placeholder).toBe('Ref input');
  });

  it('clears a controlled value when the clear button is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    function ControlledInput() {
      const [v, setV] = React.useState('Alice');
      return (
        <Input
          label="Name"
          value={v}
          onChange={(e) => {
            onChange(e.target.value);
            setV(e.target.value);
          }}
        />
      );
    }

    render(<ControlledInput />);
    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('Alice');

    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
    expect(onChange).toHaveBeenCalledWith('');
  });

  it('clears when ref is a callback ref (react-hook-form style)', async () => {
    const user = userEvent.setup();
    let captured: HTMLInputElement | null = null;
    const ref = (node: HTMLInputElement | null) => {
      captured = node;
    };

    function ControlledInput() {
      const [v, setV] = React.useState('Bob');
      return (
        <Input
          ref={ref}
          label="Name"
          value={v}
          onChange={(e) => setV(e.target.value)}
        />
      );
    }

    render(<ControlledInput />);
    expect(captured).toBeInstanceOf(HTMLInputElement);

    await user.click(screen.getByRole('button', { name: 'Clear input' }));

    expect(screen.getByRole('textbox', { name: 'Name' })).toHaveValue('');
  });
});
