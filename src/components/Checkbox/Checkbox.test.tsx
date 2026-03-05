import { describe, expect, it } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Checkbox } from './Checkbox';

describe('UI Component: Checkbox', () => {
  it('should display the correct label text', () => {
    render(<Checkbox label="I agree to terms" />);

    expect(screen.getByText('I agree to terms')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('should render correctly without a label', () => {
    render(<Checkbox />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).not.toHaveAttribute('aria-labelledby');

    expect(screen.queryByText(/.+/)).not.toBeInTheDocument();
  });

  it('should toggle state when clicked', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Accept" />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox.getAttribute('aria-checked')).toBe('false');

    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');

    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('should toggle when clicking on the label text', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Click label" />);

    const checkbox = screen.getByRole('checkbox');
    const labelText = screen.getByText('Click label');

    await user.click(labelText);
    expect(checkbox.getAttribute('aria-checked')).toBe('true');
  });

  it('should be disabled and not toggle when disabled prop is passed', async () => {
    const user = userEvent.setup();
    render(<Checkbox label="Disabled item" disabled />);

    const checkbox = screen.getByRole('checkbox');

    expect(checkbox).toHaveAttribute('aria-disabled', 'true');
    expect(checkbox).toHaveAttribute('data-disabled');

    await user.click(checkbox);
    expect(checkbox.getAttribute('aria-checked')).toBe('false');
  });

  it('should apply custom class names to internal elements', () => {
    render(
      <Checkbox
        label="Custom"
        checkboxClassName="my-box-class"
        labelClassName="my-label-class"
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    const labelContainer = screen.getByText('Custom');

    expect(checkbox).toHaveClass('my-box-class');
    expect(labelContainer).toHaveClass('my-label-class');
  });
});
