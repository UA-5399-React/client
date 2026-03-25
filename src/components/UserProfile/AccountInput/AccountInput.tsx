import { useId, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type AccountInputProps = {
  name?: string;
  label: string;
  placeholder?: string;
  type?: string;
  value: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  showToggle?: boolean;
  autoComplete?: string;
};

export function AccountInput({
  name,
  label,
  placeholder,
  type = 'text',
  value,
  onChange,
  disabled = false,
  showToggle = false,
  autoComplete,
}: AccountInputProps) {
  const inputId = useId();
  const isPasswordField = type === 'password' && showToggle;
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPasswordField && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor={inputId}
        className="text-[12px] font-bold text-[rgb(var(--color-gray-600))] uppercase"
      >
        {label}
      </label>

      <div className="relative">
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          className="h-[40px] w-full rounded-md border border-[rgb(var(--color-gray-300))] pl-4 text-sm text-[rgb(var(--color-neutral-900))] transition outline-none focus:border-[rgb(var(--color-neutral-900))] disabled:bg-[rgb(var(--color-neutral-600))]"
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="absolute inset-y-0 right-1 flex items-center border-none bg-transparent text-[rgb(var(--color-gray-600))]"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
