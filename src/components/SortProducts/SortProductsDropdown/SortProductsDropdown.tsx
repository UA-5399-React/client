import { useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';

import { SortOrderButton, SortRadioItem } from '@/components';
import type {
  ProductSortField,
  SortOrder,
  SortValue,
} from '@/types/productsSort';
import { PRODUCT_SORT_FIELDS } from '@/types/productsSort';
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
  const [isOpen, setIsOpen] = useState(false);

  // Parse current sorting value into structured object
  const current = parseSortValue(value);

  // Handles change of the sorting field (name, price, etc.)
  const handleFieldChange = (field: ProductSortField) => {
    let nextOrder: SortOrder = current.order;

    if (field === PRODUCT_SORT_FIELDS.UPDATED_AT) {
      nextOrder = 'desc';
    }

    onChange(buildSortValue(field, nextOrder));
    setIsOpen(false);
  };

  // Handles change of sorting direction (asc / desc)
  const handleOrderChange = (order: SortOrder) => {
    onChange(buildSortValue(current.sort, order));
    setIsOpen(false);
  };

  return (
    <div className="relative shrink-0">
      <button
        type="button"
        aria-label="Open sorting menu"
        onClick={() => setIsOpen((prev) => !prev)}
        className="text-placeholderText flex h-11 w-11 items-center justify-center rounded-xl border border-gray-300 bg-white shadow-sm transition hover:bg-gray-50"
      >
        <ArrowUpDown size={20} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10 bg-transparent"
            onClick={() => setIsOpen(false)}
          />

          <div className="absolute top-14 right-0 z-20 w-[250px] overflow-hidden rounded-2xl border border-gray-200 bg-white text-gray-900 shadow-xl">
            <div className="border-b border-gray-200 px-5 py-4">
              <p className="text-[18px] font-medium text-gray-500">Sort by</p>

              <div className="mt-4 space-y-4">
                <SortRadioItem
                  checked={current.sort === PRODUCT_SORT_FIELDS.TITLE}
                  label="Name"
                  onClick={() => handleFieldChange(PRODUCT_SORT_FIELDS.TITLE)}
                />

                <SortRadioItem
                  checked={current.sort === PRODUCT_SORT_FIELDS.PRICE}
                  label="Price"
                  onClick={() => handleFieldChange(PRODUCT_SORT_FIELDS.PRICE)}
                />

                <SortRadioItem
                  checked={current.sort === PRODUCT_SORT_FIELDS.UPDATED_AT}
                  label="Last updated"
                  onClick={() =>
                    handleFieldChange(PRODUCT_SORT_FIELDS.UPDATED_AT)
                  }
                />

                <SortRadioItem
                  checked={current.sort === PRODUCT_SORT_FIELDS.CREATED_AT}
                  label="Created date"
                  onClick={() =>
                    handleFieldChange(PRODUCT_SORT_FIELDS.CREATED_AT)
                  }
                />
              </div>
            </div>

            <div className="px-3 py-3">
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
