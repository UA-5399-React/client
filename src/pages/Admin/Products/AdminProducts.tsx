import { useState } from 'react';

import {
  Button,
  Pagination,
  ProductFiltersBar,
  SearchInput,
  TableProducts,
} from '@/components';
import { DEFAULT_FILTER } from '@/constants';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDuplicate } from '@/hooks/useDuplicate';
import { useTheme } from '@/hooks/useTheme';
import { type ProductsFilters } from '@/types/filters';

const LIMIT = 10;

export function AdminProducts() {
  const { isDark } = useTheme();

  const [filters, setFilters] = useState<ProductsFilters>(DEFAULT_FILTER);

  const [showFilters, setShowFilters] = useState(false);

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const { duplicateProduct } = useDuplicate();

  const { items, loading, error, totalPages } = useAdminProducts({
    page,
    limit: LIMIT,
    search: debouncedSearch,
    filters,
  });

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  // reset page immediately when yser types
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

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

      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <Button
          variant="outline"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 border-gray-300 text-gray-700"
        >
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="border-b border-[#e5e7eb] bg-gray-50 px-4 py-3 text-gray-700">
          <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>
      )}

      <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        {/* Search */}
        <div className="flex w-full items-center justify-end border-b border-[#e5e7eb] p-4">
          <div className="w-full max-w-[360px]">
            <SearchInput value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Table */}
        <TableProducts
          items={items}
          loading={loading}
          error={error}
          onDuplicate={duplicateProduct}
        />

        <Pagination
          currentPage={page}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
