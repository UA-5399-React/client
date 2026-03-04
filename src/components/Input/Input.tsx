import * as React from 'react';
import { Input as BaseInput } from '@base-ui/react/input';
import clsx from 'clsx';

const BASE_INPUT_CLASSES =
  'w-full bg-transparent transition-colors outline-none ' +
  'placeholder-muted-foreground dark:placeholder-neutral-400 ' +
  'text-text dark:text-neutral-500 ' +
  'disabled:cursor-not-allowed ';

const WRAPPER_CLASSES =
  'group flex w-full flex-col gap-1.5 has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

const LABEL_CLASSES = 'text-sm font-medium text-text';

const HELPER_TEXT_CLASSES = 'mt-0 ml-2 text-xs';

const VARIANT_STYLES = {
  outlined: 'border rounded-md px-3 py-2',
  underlined: 'border-0 border-b pb-2 px-0',
};

const STATE_STYLES = {
  default: {
    outlined:
      'border-neutral-300 dark:border-neutral-700 ' +
      'hover:border-neutral-400 dark:hover:border-neutral-500 ' +
      'focus:border-neutral-950 focus:ring-1 focus:ring-neutral-950/10 ' +
      'dark:focus:border-neutral-100 dark:focus:ring-neutral-100/10',
    underlined:
      'border-neutral-300 dark:border-neutral-700 ' +
      'hover:border-neutral-400 dark:hover:border-neutral-500 ' +
      'focus:border-neutral-950 dark:focus:border-neutral-100',
  },

  success: 'border-green-600 text-green-700 ',
  error: 'border-red-600 text-red-600',
};

const ICON_WRAPPER_CLASSES =
  'pointer-events-none absolute left-0 flex items-center text-gray-600';
const RIGHT_ELEMENT_CLASSES =
  'absolute right-0 flex items-center text-gray-600 transition-colors dark:text-neutral-50';

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

    const paddingClasses = clsx({
      'pl-10': leftIcon,
      'pr-12': rightElement || isPassword,
    });

    const currentStateStyles =
      state === 'default' ? STATE_STYLES.default[variant] : STATE_STYLES[state];

    return (
      <div className={clsx(WRAPPER_CLASSES, className)}>
        {label && (
          <label htmlFor={inputId} className={LABEL_CLASSES}>
            {label}
          </label>
        )}

        <div className="relative flex w-full items-center">
          {leftIcon && (
            <div
              className={clsx(
                ICON_WRAPPER_CLASSES,
                variant === 'underlined' && 'pb-2',
              )}
            >
              {leftIcon}
            </div>
          )}

          <BaseInput
            {...props}
            id={inputId}
            ref={ref}
            type={inputType}
            className={clsx(
              BASE_INPUT_CLASSES,
              VARIANT_STYLES[variant],
              currentStateStyles,
              paddingClasses,
              inputClassName,
            )}
          />

          {(isPassword || rightElement) && (
            <div
              className={clsx(
                RIGHT_ELEMENT_CLASSES,
                variant === 'outlined' ? 'pr-3' : 'pr-0',
              )}
            >
              {isPassword ? (
                <button
                  type="button"
                  onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                  className="flex items-center justify-center border-none bg-transparent p-0 text-gray-600 transition-colors hover:cursor-pointer hover:text-neutral-800 focus:outline-none dark:text-gray-200 dark:hover:text-white dark:focus:text-white"
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
                <div className="flex cursor-pointer items-center text-gray-500 transition-colors hover:text-gray-900 dark:text-neutral-400 dark:hover:text-neutral-50">
                  {rightElement}
                </div>
              )}
            </div>
          )}
        </div>

        {helperText && (
          <span
            id={`${inputId}-helper`}
            className={clsx(
              HELPER_TEXT_CLASSES,
              state === 'error' ? 'text-red-600' : 'text-gray-600',
            )}
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
