import * as React from 'react';
import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';

export interface CheckboxProps extends React.ComponentPropsWithoutRef<
  typeof BaseCheckbox.Root
> {
  label?: string;
  iconClassName?: string;
}

export function Checkbox({
  label = '',
  iconClassName = '',
  ...props
}: CheckboxProps) {
  return (
    <label className="group flex w-fit cursor-pointer items-start select-none has-[:disabled]:cursor-not-allowed has-[:disabled]:opacity-50">
      <BaseCheckbox.Root
        {...props}
        className={`bg-background border-muted aria-[checked=true]:bg-text aria-[checked=true]:border-text dark:aria-[checked=false]:hover:bg-background flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-2 transition-colors aria-[checked=false]:hover:bg-gray-100 ${iconClassName}`}
      >
        <BaseCheckbox.Indicator className="flex items-center justify-center">
          <CheckIcon className="text-background" />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>

      {label && (
        <span className="text-text ml-3 text-base leading-6 font-normal">
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
