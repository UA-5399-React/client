import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Button } from './Button';

describe('UI Component: Button', () => {
  // 1. Basic Rendering
  it('should display the correct text (children)', () => {
    render(<Button>Click me</Button>);

    // Rule: find the button by its role and text (best practice for a11y)
    const buttonElement = screen.getByRole('button', { name: 'Click me' });
    expect(buttonElement).toBeInTheDocument();
  });

  // 2. Interactivity (events)
  it('should call the onClick handler when clicked', async () => {
    const user = userEvent.setup(); // Emulate a real user
    const handleClick = vi.fn(); // Create a spy for the click handler

    render(<Button onClick={handleClick}>Send</Button>);

    const buttonElement = screen.getByRole('button', { name: 'Send' });
    await user.click(buttonElement);

    // Check that the function was called exactly once
    expect(handleClick).toHaveBeenCalledOnce();
  });

  // 3. Accessibility and states (disabled)
  it('should not call onClick and should be disabled if disabled prop is passed', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button disabled onClick={handleClick}>
        Loading...
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: 'Loading...' });

    // Check the HTML attribute for the disabled state
    expect(buttonElement).toBeDisabled();

    // Emulate a click and ensure the handler is ignored
    await user.click(buttonElement);
    expect(handleClick).not.toHaveBeenCalled();
  });

  // 4. Props and classes
  it('should accept a custom className and standard HTML attributes', () => {
    render(
      <Button className="my-custom-class" type="submit" aria-expanded="true">
        Save
      </Button>,
    );

    const buttonElement = screen.getByRole('button', { name: 'Save' });

    // Check that our custom class was applied correctly
    expect(buttonElement).toHaveClass('my-custom-class');

    // Check that props like type and aria-* were passed through correctly (...props)
    expect(buttonElement).toHaveAttribute('type', 'submit');
    expect(buttonElement).toHaveAttribute('aria-expanded', 'true');
  });
});
