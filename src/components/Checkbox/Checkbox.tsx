import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import clsx from 'clsx';

const BASE_CHECKBOX_CLASSES =
  'bg-background border-muted aria-[checked=true]:bg-text aria-[checked=true]:border-text ' +
  'dark:aria-[checked=false]:hover:bg-background flex h-6 w-6 shrink-0 items-center ' +
  'justify-center rounded-md border-2 transition-colors aria-[checked=false]:hover:bg-gray-100';

const BASE_WRAPPER_CLASSES =
  'group flex w-fit cursor-pointer items-start select-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50';

const BASE_LABEL_CLASSES = 'text-text ml-3 text-base leading-6 font-normal';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof BaseCheckbox.Root
> {
  label?: React.ReactNode;
  checkboxClassName?: string;
  checkmarkClassName?: string;
  labelClassName?: string;
  state?: 'default' | 'error';
}

export function Checkbox({
  label,
  className = '',
  checkboxClassName = '',
  checkmarkClassName = 'text-background',
  labelClassName = '',
  state = 'default',
  ...props
}: CheckboxProps) {
  const labelId = React.useId();
  return (
    <label className={BASE_WRAPPER_CLASSES}>
      <BaseCheckbox.Root
        {...props}
        aria-labelledby={label ? labelId : undefined}
        className={clsx(
          BASE_CHECKBOX_CLASSES,
          state === 'error' && 'border-red-500',
          className,
          checkboxClassName,
        )}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center">
          <CheckIcon className={checkmarkClassName} />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>

      {label && (
        <span id={labelId} className={clsx(BASE_LABEL_CLASSES, labelClassName)}>
          {label}
        </span>
      )}
    </label>
  );
}

function CheckIcon({ className, ...props }: React.ComponentProps<'svg'>) {
  return (
    <svg
      fill="none"
      width="12"
      height="9"
      viewBox="0 0 12 9"
      className={className}
      {...props}
    >
      <path
        d="M10.3333 1L3.91667 7.41667L1 4.5"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
