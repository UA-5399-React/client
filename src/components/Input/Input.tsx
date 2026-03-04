import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';

export interface InputProps extends React.ComponentPropsWithoutRef<
  typeof BaseInput
> {
  variant?: 'outlined' | 'underlined';
  state?: 'default' | 'success' | 'error';
  label?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
  inputClassName?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      variant = 'outlined',
      state = 'default',
      label,
      helperText,
      leftIcon,
      rightElement,
      type = 'text',
      className = '',
      inputClassName = '',
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const inputId = id || reactId;
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && isPasswordVisible ? 'text' : type;

    const baseStyles =
      'w-full bg-transparent transition-colors outline-none placeholder-gray-300 text-neutral-800 dark:text-neutral-50 dark:placeholder-gray-200 disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<'outlined' | 'underlined', string> = {
      outlined: 'border rounded-md px-3 py-2',
      underlined: 'border-b pb-2 px-0',
    };

    const stateStyles: Record<'default' | 'success' | 'error', string> = {
      default:
        variant === 'outlined'
          ? 'border-gray-300 hover:border-gray-600 focus:border-neutral-800 dark:border-gray-300 dark:hover:border-white dark:focus:border-neutral-50'
          : 'border-gray-600/50 focus:border-neutral-800 dark:border-gray-600 dark:focus:border-white',
      success: 'border-green-500 text-green-500 focus:border-green-500',
      error: 'border-red-600 text-gray-500 focus:border-red-600',
    };

    const paddingStyles = `
      ${leftIcon ? 'pl-10' : ''} 
      ${rightElement || isPassword ? 'pr-12' : ''}
    `.trim();

    return (
      <div
        className={`group flex w-full flex-col gap-1.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50 ${className}`}
      >
        {label && (
          <label
            htmlFor={inputId}
            className="cursor-pointer text-sm font-medium text-neutral-800 dark:text-white"
          >
            {label}
          </label>
        )}

        <div className="relative flex w-full items-center">
          {leftIcon && (
            <div
              className={`${variant === 'underlined' ? 'pb-2' : ''} pointer-events-none absolute left-0 flex items-center text-gray-600`}
            >
              {leftIcon}
            </div>
          )}

          <BaseInput
            {...props}
            id={inputId}
            ref={ref}
            type={inputType}
            className={`${baseStyles} ${variantStyles[variant]} ${stateStyles[state]} ${paddingStyles} ${inputClassName}`}
          />

          {(isPassword || rightElement) && (
            <div
              className={`absolute right-0 ${variant === 'outlined' ? 'pr-3' : 'pr-0'} flex items-center text-gray-600 transition-colors dark:text-neutral-50`}
            >
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="text-gray-600 transition-colors hover:cursor-pointer hover:text-neutral-800 focus:outline-none dark:text-gray-200 dark:hover:text-white dark:focus:text-white"
                  aria-label={
                    isPasswordVisible ? 'Hide password' : 'Show password'
                  }
                >
                  {isPasswordVisible ? (
                    <EyeIcon className="h-5 w-5" />
                  ) : (
                    <EyeSlashIcon className="h-5 w-5" />
                  )}
                </button>
              ) : (
                <div className="flex items-center text-gray-500 transition-colors hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-50">
                  {rightElement}
                </div>
              )}
            </div>
          )}
        </div>

        {helperText && (
          <span
            id={`${inputId}-helper`}
            className={`mt-0 ml-2 text-xs ${state === 'error' ? 'text-red-600' : 'text-gray-600'}`}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';

function EyeIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
      {...props}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
      />
    </svg>
  );
}
