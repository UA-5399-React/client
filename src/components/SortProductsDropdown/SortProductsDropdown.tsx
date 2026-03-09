import { type ReactNode, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import type {
  ProductSortField,
  SortOrder,
  SortValue,
} from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

type SortProductsDropdownProps = {
  value: SortValue;
  onChange: (value: SortValue) => void;
};

export function SortProductsDropdown({
  value,
  onChange,
}: SortProductsDropdownProps) {
  // Controls whether the dropdown sorting menu is open
  const [open, setOpen] = useState(false);

  // Parse current sorting value into structured object
  const current = parseSortValue(value);

  // Handles change of the sorting field (name, price, etc.)
  const handleFieldChange = (field: ProductSortField) => {
    let nextOrder: SortOrder = current.order;

    if (field === 'updatedAt') {
      nextOrder = 'desc';
    }

    onChange(buildSortValue(field, nextOrder));
    setOpen(false);
  };

  // Handles change of sorting direction (asc / desc)
  const handleOrderChange = (order: SortOrder) => {
    onChange(buildSortValue(current.sort, order));
    setOpen(false);
  };

  return (
    <div className="relative shrink-0">
      {/* Button that toggles sorting dropdown */}
      <button
        type="button"
        aria-label="Open sorting menu"
        onClick={() => setOpen((prev) => !prev)}
        className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white text-[rgb(var(--color-placeholder))] shadow-sm transition hover:bg-gray-50"
      >
        <ArrowUpDown size={20} />
      </button>

      {/* Dropdown menu */}
      {open && (
        <>
          <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setOpen(false)}
          />

          <div className="absolute top-14 right-0 z-20 w-[250px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-xl">
            {/* Sorting field selection */}
            <div className="border-b border-gray-200 px-5 py-4">
              <p className="text-[18px] font-medium text-gray-500">Sort by</p>

              <div className="mt-4 space-y-4">
                <SortRadioItem
                  checked={current.sort === 'title'}
                  label="Name"
                  onClick={() => handleFieldChange('title')}
                />

                <SortRadioItem
                  checked={current.sort === 'price'}
                  label="Price"
                  onClick={() => handleFieldChange('price')}
                />

                <SortRadioItem
                  checked={current.sort === 'updatedAt'}
                  label="Last updated"
                  onClick={() => handleFieldChange('updatedAt')}
                />

                <SortRadioItem
                  checked={current.sort === 'createdAt'}
                  label="Created date"
                  onClick={() => handleFieldChange('createdAt')}
                />
              </div>
            </div>

            <div className="px-3 py-3">
              {/* Sorting order selection */}
              <SortOrderButton
                active={current.order === 'asc'}
                icon={<ArrowUp size={20} />}
                label="Ascending"
                onClick={() => handleOrderChange('asc')}
              />

              <SortOrderButton
                active={current.order === 'desc'}
                icon={<ArrowDown size={20} />}
                label="Descending"
                onClick={() => handleOrderChange('desc')}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// Component representing a radio-like option for selecting sorting field
type SortRadioItemProps = {
  checked: boolean;
  label: string;
  onClick: () => void;
};

function SortRadioItem({ checked, label, onClick }: SortRadioItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-4 border-none bg-transparent text-left"
    >
      <span
        className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
          checked ? 'border-blue-500' : 'border-gray-400'
        }`}
      >
        {checked && <span className="h-4 w-4 rounded-full bg-blue-500" />}
      </span>

      <span className="text-[16px] text-neutral-800">{label}</span>
    </button>
  );
}

// Button for selecting sorting order (ascending / descending)
type SortOrderButtonProps = {
  active: boolean;
  icon: ReactNode;
  label: string;
  onClick: () => void;
};

function SortOrderButton({
  active,
  icon,
  label,
  onClick,
}: SortOrderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-[16px] transition ${
        active
          ? 'border border-blue-500 bg-blue-50 text-blue-600'
          : 'border-none bg-transparent text-gray-800 hover:bg-gray-50'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
