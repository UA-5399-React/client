import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

import type { DropdownProps } from './Dropdown.types';

import styles from './Dropdown.module.css';

export const Dropdown = ({
  label,
  options,
  onChange,
  selectedValues,
  selectClassName,
  labelClassName,
  placeholder = 'Select options',
  hasBorder = true,
  multiple = true,
  disabled = false,
  required = false,
}: DropdownProps) => {
  const selectedOptions = selectedValues
    ? options.filter((option) => selectedValues.includes(option.value))
    : undefined;

  const value = selectedOptions
    ? multiple
      ? selectedOptions.map((option) => option.value)
      : (selectedOptions[0]?.value ?? null)
    : undefined;

  const handleValueChange = (value: string | string[] | null) => {
    if (!value) {
      onChange([]);
      return;
    }

    const selectedValues = Array.isArray(value) ? value : [value];

    const selected = selectedValues
      .map((selectedValue) =>
        options.find((option) => option.value === selectedValue),
      )
      .filter(Boolean) as DropdownProps['options'];

    onChange(selected);
  };

  return (
    <Field.Root className={styles.Field}>
      <Field.Label
        className={clsx(
          styles.Label,
          'cursor-default text-xs font-medium text-(--color-text) uppercase',
          labelClassName,
        )}
        nativeLabel={false}
        render={<div />}
      >
        {label} {required && <span className="font-bold text-red-500">*</span>}
      </Field.Label>

      <Select.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        value={value}
        items={options}
        disabled={disabled}
      >
        <Select.Trigger
          className={clsx(styles.Select, selectClassName)}
          data-border={hasBorder}
          data-disabled={disabled || undefined}
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
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className={styles.Item}
                >
                  <Select.ItemText className={styles.ItemText}>
                    {option.label}
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
