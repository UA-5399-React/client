import { Dropdown } from '../Dropdown';

const CATEGORY_OPTIONS = [
  { label: 'Laptop', value: 'Laptop' },
  { label: 'Apple', value: 'Apple' },
  { label: 'Audio', value: 'Audio' },
];

interface CategoryFilterProps {
  value: string[];
  onChange: (value: string[]) => void;
}

export function CategoryFilter({ onChange }: CategoryFilterProps) {
  return (
    <Dropdown
      label="Category"
      options={CATEGORY_OPTIONS}
      onChange={onChange}
      placeholder="All categories"
    />
  );
}
