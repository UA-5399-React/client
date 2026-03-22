import clsx from 'clsx';
import { Search, XCircleIcon } from 'lucide-react';

type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean;
  className?: string;
};

export function SearchInput({
  value,
  onChange,
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={clsx(
          'box-border h-[44px] w-full rounded-[8px] border',
          'px-[42px] py-[10px]',
          'text-[16px] leading-[24px] font-normal',
          'shadow-[0_1px_2px_0_rgb(var(--color-shadow)/0.05)]',
          borderClass,
          stateClass,
          focusClass,
        )}
      />

      {value.length > 0 && (
        <XCircleIcon
          size={17}
          className="absolute top-1/2 right-[14px] -translate-y-1/2 cursor-pointer"
          onClick={() => onChange('')}
        />
      )}
    </div>
  );
}
