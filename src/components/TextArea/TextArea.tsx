import * as React from 'react';

export interface TextAreaProps extends React.ComponentPropsWithoutRef<'textarea'> {
  variant?: 'outlined';
  state?: 'default' | 'success' | 'error';
  label?: string;
  helperText?: string;
  textAreaClassName?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      variant = 'outlined',
      state = 'default',
      label,
      helperText,
      className = '',
      textAreaClassName = '',
      id,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const textAreaId = id || reactId;
    const helperId = `${textAreaId}-helper`;

    const baseStyles =
      'text-sm min-h-20 border-neutral-500 font-sans bg-transparent transition-colors outline-none placeholder-neutral-500 dark:placeholder-neutral-400 text-black dark:text-white disabled:opacity-50 disabled:cursor-not-allowed';

    const variantStyles: Record<'outlined', string> = {
      outlined: 'border rounded-md px-3 py-2',
    };

    const stateStyles: Record<'default' | 'success' | 'error', string> = {
      default:
        variant === 'outlined'
          ? 'border-gray-500 focus:border-neutral-100 dark:border-neutral-700 dark:focus:border-neutral-50 focus:ring-1 focus:ring-neutral-700/90 dark:focus:ring-neutral-100/10'
          : 'border-neutral-600/50 focus:border-neutral-800 dark:border-gray-600 dark:focus:border-white',
      success:
        'border-green-500 text-green-600 dark:text-green-500 focus:border-green-500',
      error:
        'border-red-600 text-red-600 dark:text-red-500 focus:border-red-600',
    };

    return (
      <div
        className={`group flex w-full flex-col gap-1.5 has-disabled:cursor-not-allowed has-disabled:opacity-50 ${className}`}
      >
        {label && (
          <label
            htmlFor={textAreaId}
            className="cursor-pointer text-sm font-medium dark:text-white"
          >
            {label}
          </label>
        )}

        <textarea
          {...props}
          id={textAreaId}
          ref={ref}
          aria-describedby={helperText ? helperId : props['aria-describedby']}
          className={`${baseStyles} ${variantStyles[variant]} ${stateStyles[state]} ${textAreaClassName}`}
        />

        {helperText && (
          <span
            id={helperId}
            className={`mt-0 ml-2 text-xs ${
              state === 'error'
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-600 dark:text-gray-400'
            }`}
          >
            {helperText}
          </span>
        )}
      </div>
    );
  },
);

TextArea.displayName = 'TextArea';
