import { useId, useState } from 'react';
import type {
  Control,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import { useWatch } from 'react-hook-form';
import clsx from 'clsx';

import { SearchInput } from '@/components';
import { PAGE, PAGE_LIMIT } from '@/constants/general';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type { OrderFormData } from '@/types/tableOrders.types';

type OrderProductSearchProps = {
  index: number;
  control: Control<OrderFormData>;
  setValue: UseFormSetValue<OrderFormData>;
  getValues: UseFormGetValues<OrderFormData>;
  disabled?: boolean;
  error?: string;
};

export function OrderProductSearch({
  index,
  control,
  setValue,
  getValues,
  disabled,
  error,
}: OrderProductSearchProps) {
  const fieldId = useId();
  const inputId = `order-product-search-${fieldId}`;
  const productName = useWatch({
    control,
    name: `items.${index}.productName`,
  });
  const [draft, setDraft] = useState<string | null>(null);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const inputValue = draft === null ? (productName ?? '') : draft;
  const debouncedSearch = useDebouncedValue(inputValue.trim(), 500);

  const { items, loading } = useAdminProducts({
    page: PAGE,
    limit: PAGE_LIMIT,
    search: debouncedSearch,
  });

  const handleSearchChange = (value: string) => {
    setDraft(value);
    if (value.trim().length > 0) {
      setSuggestionsOpen(true);
    }
    const name = getValues(`items.${index}.productName`);
    if (name && value.trim() !== name.trim()) {
      setValue(`items.${index}.productName`, '', { shouldValidate: true });
      setValue(`items.${index}.price`, '', { shouldValidate: true });
    }
  };

  const handleSelectProduct = (title: string, price: number) => {
    setValue(`items.${index}.productName`, title, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setValue(`items.${index}.price`, String(price), {
      shouldValidate: true,
      shouldDirty: true,
    });
    setDraft(null);
    setSuggestionsOpen(false);
  };

  const showSuggestions = suggestionsOpen && !disabled;

  return (
    <div
      className={clsx(
        'relative flex min-w-0 flex-col gap-1.5',
        showSuggestions && 'z-50',
      )}
    >
      <label
        htmlFor={inputId}
        className="text-sm font-medium text-[rgb(var(--color-text))]"
      >
        Search product
      </label>

      <div className="relative">
        <SearchInput
          id={inputId}
          value={inputValue}
          onChange={handleSearchChange}
          onFocus={() => setSuggestionsOpen(true)}
          placeholder="Search or pick a product"
          disabled={disabled}
          error={!!error}
          className="w-full! max-w-none"
        />
        {showSuggestions ? (
          <div
            className="absolute top-full left-0 z-10 mt-1 max-h-44 w-full min-w-0 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-md dark:border-gray-600 dark:bg-gray-900"
            role="listbox"
            aria-label="Product search results"
          >
            {loading ? (
              <p className="px-3 py-2 text-sm text-gray-500">Loading...</p>
            ) : null}
            {!loading && items.length === 0 ? (
              <p className="px-3 py-2 text-sm text-gray-500">
                No products found
              </p>
            ) : null}

            {!loading &&
              items.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  role="option"
                  disabled={disabled}
                  onClick={() =>
                    handleSelectProduct(product.title, product.price)
                  }
                  className="flex w-full flex-col items-start gap-0.5 border-b border-gray-100 px-3 py-2.5 text-left text-sm last:border-b-0 hover:bg-gray-50 dark:border-gray-700 dark:hover:bg-gray-800"
                >
                  <span className="font-medium text-gray-900 dark:text-gray-100">
                    {product.title}
                  </span>

                  <span className="text-gray-600 dark:text-gray-400">
                    ${product.price.toFixed(2)}
                  </span>
                </button>
              ))}
          </div>
        ) : null}
      </div>

      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </div>
  );
}
