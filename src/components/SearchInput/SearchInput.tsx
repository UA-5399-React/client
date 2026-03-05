import { Search } from 'lucide-react';

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
  // disabled -> gray border
  // error -> red border
  // default -> neutral border
  const borderClass = disabled
    ? 'border-[#6C7275]'
    : error
      ? 'border-[#E02020]'
      : 'border-[#D0D5DD]';

  // Background and text styles depending on state
  const stateClass = disabled
    ? 'bg-[#F2F4F6] text-[rgba(102,112,133,0.7)] placeholder:text-[rgba(102,112,133,0.7)] cursor-not-allowed'
    : 'bg-[#FFF] text-[#667085] placeholder:text-[#667085]';

  // Focus state
  const focusClass =
    disabled || error
      ? 'focus:outline-none'
      : 'focus:outline-none focus:border-[#141718]';

  // Search icon color depending on state
  const iconClass = disabled
    ? 'text-[rgba(102,112,133,0.7)]'
    : error
      ? 'text-[#E02020]'
      : 'text-[#667085]';

  return (
    <div className={`relative w-[320px] ${className}`}>
      <Search
        size={16}
        className={`pointer-events-none absolute top-1/2 left-[14px] -translate-y-1/2 ${iconClass}`}
      />

      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={error || undefined}
        className={[
          'box-border h-[44px] w-full rounded-[8px] border',
          'py-[10px] pr-[14px] pl-[42px]',
          'text-[16px] leading-[24px] font-normal',
          'shadow-[0_1px_2px_0_rgba(16,24,40,0.05)]',
          borderClass,
          stateClass,
          focusClass,
        ].join(' ')}
      />
    </div>
  );
}
