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
        className={
          styles.Label +
          clsx(
            'cursor-default text-xs font-medium text-(--color-text) uppercase',
            labelClassName,
          )
        }
        nativeLabel={false}
        render={<div />}
      >
        {label}
      </Field.Label>
      <Select.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        value={value}
      >
        <Select.Trigger
          className={styles.Select + clsx(selectClassName)}
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
