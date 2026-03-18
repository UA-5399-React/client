import { Checkbox } from '@/components/Checkbox';
import { Dropdown } from '@/components/Dropdown';
import { Input } from '@/components/Input';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import type { ProductsFilters } from '@/types/filters';

const STATUS_OPTIONS = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
];

interface ProductFiltersBarProps {
  filters: ProductsFilters;
  onChange: (filters: ProductsFilters) => void;
}

export function ProductFiltersBar({
  filters,
  onChange,
}: ProductFiltersBarProps) {
  const update = (partial: Partial<ProductsFilters>) =>
    onChange({ ...filters, ...partial });

  const { categories } = useAdminCategories();
  const categoryOptions = categories.map((c) => ({
    label: c.title,
    value: c.id,
  }));

  return (
    <div className="flex flex-wrap items-end gap-6">
      <Dropdown
        label="Categories"
        options={categoryOptions}
        onChange={(values) =>
          update({ categories: values.map((item) => item.value) })
        }
        placeholder="All categories"
      />
      <div className="flex flex-col gap-1.5">
        <div className="flex items-end gap-2">
          <Input
            label="Price"
            type="number"
            placeholder="Min"
            value={filters.minPrice}
            onChange={(e) => update({ minPrice: e.target.value })}
            inputClassName="w-24 text-gray-700"
          />
          <span className="mb-2 text-gray-400">—</span>
          <Input
            type="number"
            placeholder="Max"
            value={filters.maxPrice}
            onChange={(e) => update({ maxPrice: e.target.value })}
            inputClassName="w-24 text-gray-700"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-text text-sm font-medium">Status</span>
        <div className="flex items-center gap-4">
          {STATUS_OPTIONS.map((opt) => (
            <Checkbox
              key={opt.value}
              label={opt.label}
              checked={filters.status === opt.value}
              onCheckedChange={(checked) =>
                update({ status: checked ? opt.value : '' })
              }
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-2">
          <Input
            type="date"
            label="From"
            value={filters.dateFrom}
            onChange={(e) => update({ dateFrom: e.target.value })}
            inputClassName="w-24 text-gray-700"
          />
          <span className="mt-5 text-gray-400">—</span>
          <Input
            type="date"
            label="To"
            value={filters.dateTo}
            onChange={(e) => update({ dateTo: e.target.value })}
            inputClassName="w-24 text-gray-700"
          />

          <div className="flex items-center gap-2">
            <span className="text-text text-sm font-medium">Date</span>

            <Checkbox
              label="Created"
              checked={filters.dateField === 'createdAt'}
              onCheckedChange={() => update({ dateField: 'createdAt' })}
            />
            <Checkbox
              label="Updated"
              checked={filters.dateField === 'updatedAt'}
              onCheckedChange={() => update({ dateField: 'updatedAt' })}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
