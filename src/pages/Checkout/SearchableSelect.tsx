import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { ChevronDown, Loader2 } from 'lucide-react';

interface Option {
  value: string;
  label: string;
}

interface SearchableSelectProps {
  isDark: boolean;
  hasError?: boolean;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  options: Option[];
  isLoading?: boolean;
  onSearchChange?: (search: string) => void;
  disabled?: boolean;
}

export const SearchableSelect = ({
  isDark,
  hasError,
  value,
  onChange,
  placeholder,
  options,
  isLoading,
  onSearchChange,
  disabled,
}: SearchableSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const selectedOption = options.find((o) => o.value === value)?.label ?? value;

  const handleSearchChange = (val: string) => {
    setSearch(val);
    onSearchChange?.(val);
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setSearch('');
    onSearchChange?.('');
  };

  const triggerClass = clsx(
    'box-border h-10 w-full rounded-md border px-[15px] text-sm outline-none transition-colors',
    'flex items-center justify-between pr-10 text-left',
    isDark
      ? 'border-gray-700 bg-black text-white'
      : 'border-[#CBCBCB] bg-white text-[#141718]',
    hasError &&
      (isDark ? 'border-red-500 text-red-200' : 'border-red-500 text-red-600'),
    disabled && 'cursor-not-allowed opacity-50',
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={triggerClass}
      >
        <span className={clsx(!value && 'text-gray-500')}>
          {value ? selectedOption : placeholder}
        </span>
        <ChevronDown
          className={clsx(
            'pointer-events-none absolute right-3 h-4 w-4',
            isDark ? 'text-gray-500' : 'text-[#6C7275]',
          )}
        />
      </button>
      {isOpen && (
        <div
          className={clsx(
            'absolute top-full left-0 z-50 mt-1 w-full rounded-md border shadow-lg',
            isDark
              ? 'border-gray-700 bg-[#141718]'
              : 'border-[#CBCBCB] bg-white',
          )}
        >
          <div className="p-2">
            <input
              autoFocus
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Searching..."
              className={clsx(
                'box-border w-full rounded border px-3 py-1.5 text-sm outline-none',
                isDark
                  ? 'border-gray-700 bg-black text-white placeholder:text-gray-500'
                  : 'border-[#CBCBCB] bg-white text-[#141718] placeholder:text-gray-400',
              )}
            />
          </div>

          <ul className="max-h-52 list-none overflow-y-auto">
            {isLoading ? (
              <li className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
              </li>
            ) : options.length === 0 ? (
              <li className="px-4 py-3 text-sm text-gray-500">Nothing found</li>
            ) : (
              options.map((option) => (
                <li
                  key={option.value}
                  onClick={() => handleSelect(option.value)}
                  className={clsx(
                    'cursor-pointer px-4 py-2.5 text-sm transition-colors',
                    isDark
                      ? 'text-white hover:bg-gray-800'
                      : 'text-[#141718] hover:bg-gray-50',
                    option.value === value &&
                      (isDark ? 'bg-gray-800' : 'bg-gray-100'),
                  )}
                >
                  {option.label}
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};
