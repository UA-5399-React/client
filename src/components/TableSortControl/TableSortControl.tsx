import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { Button } from '@/components';

type SortOrder = 'asc' | 'desc';

interface TableSortControlProps<T extends string> {
  label: string;
  field: T;
  currentSort: T;
  currentOrder: SortOrder;
  onSortChange: (field: T) => void;
}

export function TableSortControl<T extends string>({
  label,
  field,
  currentSort,
  currentOrder,
  onSortChange,
}: TableSortControlProps<T>) {
  const renderSortIcon = () => {
    if (currentSort !== field) {
      return <ArrowUpDown className="h-4 w-4 opacity-60" strokeWidth={2.5} />;
    }

    return currentOrder === 'asc' ? (
      <ArrowUp className="h-4 w-4" strokeWidth={2.5} />
    ) : (
      <ArrowDown className="h-4 w-4" strokeWidth={2.5} />
    );
  };

  return (
    <Button
      type="button"
      onClick={() => onSortChange(field)}
      className="!h-auto !min-h-0 !rounded-none !border-0 !bg-transparent !p-0 !font-[700] !whitespace-nowrap !text-inherit !shadow-none hover:!border-transparent hover:!bg-transparent"
    >
      <span className="inline-flex items-center gap-1 whitespace-nowrap">
        <span className="font-inherit">{label}</span>
        {renderSortIcon()}
      </span>
    </Button>
  );
}
