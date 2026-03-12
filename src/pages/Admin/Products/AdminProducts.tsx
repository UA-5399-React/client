import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  AdminPageHeader,
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
import { useDeleteAdminProduct } from '@/hooks/useDeleteAdminProduct';
import { useDuplicate } from '@/hooks/useDuplicate';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { type ProductsFilters } from '@/types/filters';
import type { SortValue } from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

const LIMIT = 10;

export function AdminProducts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { filters, search, sort, order, setFilters, setSearch, setSort } =
    useAdminProductsStore();

  const pageFromParams = Number(searchParams.get('page'));
  const currentPage =
    Number.isInteger(pageFromParams) && pageFromParams > 0 ? pageFromParams : 1;

  // filters
  const [showFilters, setShowFilters] = useState(false);

  // debounce for product search
  const debouncedSearch = useDebouncedValue(search.trim(), 300);
  const { duplicateProduct } = useDuplicate();
  const { deleteProduct } = useDeleteAdminProduct();

  const { items, loading, error, totalPages } = useAdminProducts({
    page: currentPage,
    limit: LIMIT,
    search: debouncedSearch,
    filters,
    sort,
    order,
  });

  const selectedSortValue = buildSortValue(sort, order);

  const setPageParam = (nextPage: number) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('page', String(nextPage));
      return next;
    });
  };

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters(newFilters);
    setPageParam(1);
  };

  // reset page immediately when yser types
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPageParam(1);
  };

  const handleSortChange = (value: SortValue) => {
    const nextSort = parseSortValue(value);
    setSort(nextSort.sort, nextSort.order);
    setPageParam(1);
  };

  //pagination
  const handlePageChange = (newPage: number) => {
    setPageParam(newPage);
  };

  const handleCreateProduct = () => {
    navigate(ROUTES.ADMIN_PRODUCT_CREATE);
  };

  return (
    <div>
      <AdminPageHeader />

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
          onDelete={deleteProduct}
          onDuplicate={duplicateProduct}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
