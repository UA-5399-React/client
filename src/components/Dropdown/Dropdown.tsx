import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { DropdownProps } from './Dropdown.types';

import styles from './Dropdown.module.css';

export const Dropdown = ({
  label,
  options,
  selectedValues,
  selectClassName,
  labelClassName,
  onChange,
  placeholder = 'Select options',
  hasBorder = true,
  multiple = true,
}: DropdownProps) => {
  const selectedOptions = selectedValues
    ? options.filter((option) => selectedValues.includes(option.value))
    : undefined;

  const value = selectedOptions
    ? multiple
      ? selectedOptions
      : (selectedOptions[0] ?? null)
    : undefined;

  const handleValueChange = (
    value: DropdownProps['options'][number] | DropdownProps['options'] | null,
  ) => {
    if (!value) {
      onChange([]);
      return;
    }

    onChange(Array.isArray(value) ? value : [value]);
  };

  return (
    <Field.Root className={styles.Field}>
      <Field.Label
        className={twMerge(
          clsx(
            'cursor-default text-xs font-medium text-[var(--color-text)] uppercase',
            labelClassName,
          ),
        )}
        nativeLabel={false}
        render={<div />}
      >
        {label}
      </Field.Label>
      <Select.Root
        multiple={multiple}
        value={value}
        onValueChange={handleValueChange}
      >
        <Select.Trigger
          className={twMerge(
            clsx(
              'm-0 box-border flex h-8 min-w-[14rem] items-center justify-between gap-3 rounded-md border border-[var(--color-gray-300)] bg-[var(--color-bg)] pr-3 pl-3.5 leading-6 text-[var(--color-text)] select-none hover:bg-[var(--color-primary)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-1px] focus-visible:outline-[var(--color-blue)] data-[popup-open]:bg-[var(--color-text)]',
              selectClassName,
            ),
          )}
          data-border={hasBorder}
        >
          <Select.Value className={styles.Value} placeholder={placeholder} />
          <Select.Icon className={styles.SelectIcon}>
            <ChevronDown className="w-4" />
          </Select.Icon>
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner
            className={styles.Positioner}
            sideOffset={8}
            alignItemWithTrigger={false}
          >
            <Select.Popup className={styles.Popup}>
              {options.map((value) => (
                <Select.Item
                  key={value.value}
                  value={value.value}
                  className={styles.Item}
                >
                  <Select.ItemText className={styles.ItemText}>
                    {value.label}
                  </Select.ItemText>
                  <Select.ItemIndicator className={styles.ItemIndicator}>
                    <Check className={styles.ItemIndicatorIcon} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
  );
};
