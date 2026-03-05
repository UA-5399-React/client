import type { ProductsFilters } from '@/types/filters';

import { CategoryFilter } from './CategoryFilter';
import { DateRangeFilter } from './DateRangeFilter';
import { PriceRangeFilter } from './PriceRangeFilter';
import { StatusFilter } from './StatusFilter';

interface Props {
  filters: ProductsFilters;
  onChange: (filters: ProductsFilters) => void;
}

export function ProductFiltersBar({ filters, onChange }: Props) {
  const update = (partial: Partial<ProductsFilters>) =>
    onChange({ ...filters, ...partial });

  return (
    <div className="filters-bar">
      <CategoryFilter
        value={filters.tags}
        onChange={(v) => update({ tags: v })}
      />
      <PriceRangeFilter
        min={filters.minPrice}
        max={filters.maxPrice}
        onChange={(min, max) => update({ minPrice: min, maxPrice: max })}
      />
      <StatusFilter
        value={filters.status}
        onChange={(v) => update({ status: v })}
      />

      <DateRangeFilter
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        dateField={filters.dateField}
        onChange={(dateFrom, dateTo, dateField) =>
          update({ dateFrom, dateTo, dateField })
        }
      />
    </div>
  );
}
