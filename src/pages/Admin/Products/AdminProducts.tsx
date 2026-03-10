import { useState } from 'react';

import {
  Button,
  Pagination,
  ProductFiltersBar,
  SearchInput,
  SortProductsDropdown,
  TableProducts,
} from '@/components';
import { DEFAULT_FILTER } from '@/constants';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTheme } from '@/hooks/useTheme';
import { type ProductsFilters } from '@/types/filters';
import type {
  ProductSortField,
  SortOrder,
  SortValue,
} from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

const LIMIT = 10;

export function AdminProducts() {
  const { isDark } = useTheme();

  // filters
  const [filters, setFilters] = useState<ProductsFilters>(DEFAULT_FILTER);
  const [showFilters, setShowFilters] = useState(false);

  // search
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // sorting
  const [sort, setSort] = useState<ProductSortField>('updatedAt');
  const [order, setOrder] = useState<SortOrder>('desc');

  // debounce for product search
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { items, loading, error, totalPages } = useAdminProducts({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    filters,
    sort,
    order,
  });

  const selectedSortValue = buildSortValue(sort, order);

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // reset page immediately when yser types
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handleSortChange = (value: SortValue) => {
    const nextSort = parseSortValue(value);

    setSort(nextSort.sort);
    setOrder(nextSort.order);
    setPage(1);
  //pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div>
      <div className="border-b border-[#CFCFCF] p-5">
        <h1
          className={`${isDark ? 'text-black' : 'text-white'} text-2xl font-bold`}
        >
          Hello, Admin
        </h1>
      </div>

      <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        <div className="flex items-center justify-between border-b border-[#e5e7eb] p-4">
          <Button
            variant="outline"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 border-gray-300 text-gray-700"
          >
            Filters
          </Button>

          <div className="flex items-center gap-4">
            {/* Sorting */}
            <SortProductsDropdown
              value={selectedSortValue}
              onChange={handleSortChange}
            />
            {/* Search */}
            <SearchInput value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Filters */}
        {showFilters && (
          <div className="border-b border-[#e5e7eb] bg-gray-50 px-4 py-3 text-gray-700">
            <ProductFiltersBar
              filters={filters}
              onChange={handleFiltersChange}
            />
          </div>
        )}

        {/* Product list */}
        <TableProducts items={items} loading={loading} error={error} />

        <Pagination
          currentPage={page}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
