export interface DropdownOption {
  value: string;
  label: string;
}

export interface DropdownProps {
  label: string;
  options: DropdownOption[];
  selectedValues?: string[];
  onChange: (value: string | null) => void;
  placeholder?: string;
  hasBorder?: boolean;
}
