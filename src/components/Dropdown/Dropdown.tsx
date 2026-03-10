import { Field } from '@base-ui/react/field';
import { Select } from '@base-ui/react/select';
import { Check, ChevronDown } from 'lucide-react';

import type { DropdownProps } from './Dropdown.types';

import styles from './Dropdown.module.css';

export const Dropdown = ({
  label,
  options,
  onChange,
  placeholder = 'Select options',
  hasBorder = true,
}: DropdownProps) => {
  return (
    <Field.Root className={styles.Field}>
      <Field.Label
        className={styles.Label}
        nativeLabel={false}
        render={<div />}
      >
        {label}
      </Field.Label>
      <Select.Root onValueChange={onChange}>
        <Select.Trigger className={styles.Select} data-border={hasBorder}>
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
