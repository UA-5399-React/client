export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValues?: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
}
