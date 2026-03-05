import { Checkbox } from '../Checkbox';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'active' },
  { label: 'Inactive', value: 'inactive' },
  { label: 'Draft', value: 'draft' },
];

interface StatusFilterProps {
  value: string; // single status or '' for all
  onChange: (value: string) => void;
}

export function StatusFilter({ value, onChange }: StatusFilterProps) {
  const handleToggle = (status: string, checked: boolean) => {
    onChange(checked ? status : '');
  };

  return (
    <div>
      <span>Status</span>
      <div>
        {STATUS_OPTIONS.map((opt) => (
          <Checkbox
            key={opt.value}
            label={opt.label}
            checked={value === opt.value}
            onCheckedChange={(checked) =>
              handleToggle(opt.value, checked as boolean)
            }
          />
        ))}
      </div>
    </div>
  );
}
