export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label?: string;
  selectClassName?: string;
  labelClassName?: string;
  options: DropdownOption[];
  selectedValues?: string[];
  onChange: (value: DropdownOption[]) => void;
  placeholder?: string;
  hasBorder?: boolean;
  multiple?: boolean;
  disabled?: boolean;
  required?: boolean;
  closeOnSelect?: boolean;
  error?: boolean;
  helperText?: string;
}
