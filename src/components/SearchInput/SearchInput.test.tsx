import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { SearchInput } from './SearchInput';

describe('UI Component: SearchInput', () => {
  it('should render the input element', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('should render the Search icon', () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} />);
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('should display the provided value', () => {
    render(<SearchInput value="hello" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveValue('hello');
  });

  it('should use "Search" as the default placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should use a custom placeholder when provided', () => {
    render(
      <SearchInput
        value=""
        onChange={vi.fn()}
        placeholder="Find products..."
      />,
    );
    expect(screen.getByPlaceholderText('Find products...')).toBeInTheDocument();
  });

  it('should call onChange with the new value when the user types', () => {
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} />);
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'abc' } });

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('abc');
  });

  it('should not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} disabled />);
    await user.type(screen.getByRole('textbox'), 'abc');

    expect(handleChange).not.toHaveBeenCalled();
  });

  it('should set the disabled attribute when disabled prop is true', () => {
    render(<SearchInput value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toBeDisabled();
  });

  it('should not be disabled by default', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).not.toBeDisabled();
  });

  it('should apply cursor-not-allowed class when disabled', () => {
    render(<SearchInput value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toHaveClass('cursor-not-allowed');
  });

  it('should apply gray border class when disabled', () => {
    render(<SearchInput value="" onChange={vi.fn()} disabled />);
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-600');
  });

  it('should set aria-invalid when error prop is true', () => {
    render(<SearchInput value="" onChange={vi.fn()} error />);
    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true');
  });

  it('should not set aria-invalid by default', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).not.toHaveAttribute('aria-invalid');
  });

  it('should apply red border class when error is true and not disabled', () => {
    render(<SearchInput value="" onChange={vi.fn()} error />);
    expect(screen.getByRole('textbox')).toHaveClass('border-red-600');
  });

  it('should not apply red border when disabled even if error is true', () => {
    render(<SearchInput value="" onChange={vi.fn()} error disabled />);
    expect(screen.getByRole('textbox')).not.toHaveClass('border-red-600');
    expect(screen.getByRole('textbox')).toHaveClass('border-gray-600');
  });

  it('should render a red icon when error is true and not disabled', () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} error />,
    );
    expect(container.querySelector('svg')).toHaveClass('text-red-600');
  });

  it('should apply the default border class in normal state', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveClass(
      'border-[rgb(var(--default-border))]',
    );
  });

  it('should apply white background in normal state', () => {
    render(<SearchInput value="" onChange={vi.fn()} />);
    expect(screen.getByRole('textbox')).toHaveClass('bg-neutral-0');
  });

  it('should forward extra className to the wrapper div', () => {
    const { container } = render(
      <SearchInput value="" onChange={vi.fn()} className="my-custom-class" />,
    );
    expect(container.firstChild).toHaveClass('my-custom-class');
  });

  it('should always have relative and w-[320px] classes on the wrapper', () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} />);
    expect(container.firstChild).toHaveClass('relative', 'w-[320px]');
  });
});
