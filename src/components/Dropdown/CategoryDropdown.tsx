import { useState } from 'react';
import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import clsx from 'clsx';
import { Check, ChevronDown } from 'lucide-react';

import type { DropdownProps } from './Dropdown.types';

import styles from './Dropdown.module.css';

export const CategoryDropdown = ({
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
  error = false,
  helperText,
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const selectedOptions = selectedValues
    ? options.filter((option) => selectedValues.includes(option.value))
    : undefined;

  if (!selectedOptions) {
    return undefined;
  }

  const value = multiple
    ? selectedOptions.map((o) => o.value)
    : (selectedOptions[0]?.value ?? null);

  const handleValueChange = (value: string | string[] | null) => {
    if (!value) {
      onChange([]);
    } else {
      const vals = Array.isArray(value) ? value : [value];
      const selected = vals
        .map((v) => options.find((o) => o.value === v))
        .filter(Boolean) as DropdownProps['options'];
      onChange(selected);
    }
    setOpen(false);
  };

  let content;
  if (!selectedOptions || selectedOptions.length === 0) {
    content = <span className={styles.Placeholder}>{placeholder}</span>;
  } else if (multiple) {
    content = selectedOptions.map((o) => o.label).join(', ');
  } else {
    content = selectedOptions[0]?.label;
  }

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
        {label}{' '}
        {required && (
          <span aria-hidden="true" className="font-bold text-red-600">
            *
          </span>
        )}
      </Field.Label>
      <Select.Root
        multiple={multiple}
        onValueChange={handleValueChange}
        value={value}
        disabled={disabled}
        open={open}
        onOpenChange={setOpen}
      >
        <Select.Trigger
          className={clsx(
            styles.Select,
            error && '!border-red-600 focus-visible:!ring-red-600',
            selectClassName,
          )}
          data-border={hasBorder}
          data-disabled={disabled || undefined}
          aria-invalid={error || undefined}
        >
          <Select.Value className="hidden" />
          <span className="truncate">{content}</span>
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
      {helperText && (
        <p className="mt-1 text-xs text-red-600" role="alert">
          {helperText}
        </p>
      )}
    </Field.Root>
  );
};
