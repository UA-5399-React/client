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
    <div className="flex w-full flex-col gap-3">
      <label
        htmlFor={inputId}
        className="text-muted text-[12px] font-bold uppercase"
      >
        {label}
      </label>

      <div className="relative w-full">
        <input
          id={inputId}
          name={name}
          type={inputType}
          placeholder={placeholder}
          value={value}
          disabled={disabled}
          autoComplete={autoComplete}
          onChange={(e) => onChange?.(e.target.value)}
          className="border-fieldBorder bg-background text-text placeholder:text-placeholderText focus:border-text disabled:bg-backgroundSec disabled:text-muted h-[40px] w-full rounded-md border px-2 text-sm transition outline-none"
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            aria-pressed={showPassword}
            className="text-muted absolute inset-y-0 right-0 flex items-center border-none bg-transparent"
          >
            {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
          </button>
        )}
      </div>
    </div>
  );
}
