import type { FocusEventHandler } from 'react';
import clsx from 'clsx';
import { Search, X } from 'lucide-react';

type SearchInputProps = {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export function SearchInput({
  id,
  value,
  onChange,
  onFocus,
  placeholder = 'Search',
  disabled = false,
  error = false,
  className = '',
}: SearchInputProps) {
  // Border color depending on component state
  const borderClass = clsx({
    'border-gray-600': disabled,
    'border-red-600': error && !disabled,
    'border-[rgb(var(--default-border))]': !disabled && !error,
  });

  // Background and text styles depending on state
  const stateClass = clsx({
    'bg-gray-200 text-[rgb(var( --color-muted)/0.7)] placeholder:text-[rgb(var(--color-placeholder)/0.7)] cursor-not-allowed':
      disabled,
    'bg-neutral-0 text-[rgb(var( --color-muted))] placeholder:text-[rgb(var(--color-placeholder))]':
      !disabled,
  });

  // Focus state
  const focusClass = clsx(
    'focus:outline-none',
    !disabled && !error && 'focus:border-neutral-800',
  );

  // Search icon color depending on state
  const iconClass = clsx({
    'text-[rgb(var(--color-muted)/0.7)]': disabled,
    'text-red-600': error && !disabled,
    'text-[rgb(var(--color-muted))]': !disabled && !error,
  });

  const showClear = value.length > 0 && !disabled;

  return (
    <div className={clsx('relative w-[320px]', className)}>
      <Search
        size={17}
        className={clsx(
          'pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2',
          iconClass,
        )}
      />

      <input
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={clsx(
          'box-border h-[44px] w-full rounded-[8px] border',
          'py-[10px] pl-[42px]',
          showClear ? 'pr-[38px]' : 'pr-[14px]',
          'text-[16px] leading-[24px] font-normal',
          'shadow-[0_1px_2px_0_rgb(var(--color-shadow)/0.05)]',
          borderClass,
          stateClass,
          focusClass,
        )}
      />

      {showClear && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Clear search"
          className="absolute top-1/2 right-[12px] -translate-y-1/2 text-[rgb(var(--color-muted))] hover:text-[rgb(var(--color-text))]"
        >
          <X size={15} />
        </button>
      )}
    </div>
  );
}
