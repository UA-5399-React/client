export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  selectClassName?: string;
  labelClassName?: string;
  options: DropdownOption[];
  selectedValues?: string[];
  onChange: (values: DropdownOption[]) => void;
  placeholder?: string;
  multiple?: boolean;
}
