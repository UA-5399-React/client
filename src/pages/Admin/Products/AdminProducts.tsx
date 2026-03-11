import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Pagination,
  ProductFiltersBar,
  SearchInput,
  SortProductsDropdown,
  TableProducts,
} from '@/components';
import { ROUTES } from '@/constants';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDuplicate } from '@/hooks/useDuplicate';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { type ProductsFilters } from '@/types/filters';
import type { SortValue } from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

const LIMIT = 10;

export function AdminProducts() {
  const navigate = useNavigate();

  const {
    filters,
    search,
    page,
    sort,
    order,
    setFilters,
    setSearch,
    setPage,
    setSort,
  } = useAdminProductsStore();

  // filters
  const [showFilters, setShowFilters] = useState(false);

  // debounce for product search
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const { duplicateProduct } = useDuplicate();

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
    setSort(nextSort.sort, nextSort.order);
    setPage(1);
  };

  //pagination
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreateProduct = () => {
    navigate(ROUTES.ADMIN_PRODUCT_CREATE);
  };

  return (
    <div>
      <div className="border-b border-[#CFCFCF] p-5">
        <h1 className="text-2xl font-bold text-[rgb(var(--color-text))]">
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

        <Button variant="primary" onClick={handleCreateProduct}>
          + Add Product
        </Button>
      </div>

      {showFilters && (
        <div className="border-b border-[#e5e7eb] bg-gray-50 px-4 py-3 text-gray-700">
          <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>
      )}

      <div className="mx-2 my-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] pb-4 shadow-md md:mx-5">
        <div className="flex items-center justify-end gap-4 border-b border-[#e5e7eb] p-4">
          <SortProductsDropdown
            value={selectedSortValue}
            onChange={handleSortChange}
          />

          <SearchInput value={search} onChange={handleSearchChange} />
        </div>

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
