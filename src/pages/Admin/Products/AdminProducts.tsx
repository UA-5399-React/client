import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListFilter } from 'lucide-react';

import {
  AdminPageHeader,
  Button,
  Pagination,
  ProductFiltersBar,
  SearchInput,
  SortProductsDropdown,
  TableProducts,
} from '@/components';
import { ADMIN_PAGE_LIMIT, ROUTES } from '@/constants';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDeleteAdminProduct } from '@/hooks/useDeleteAdminProduct';
import { useDuplicate } from '@/hooks/useDuplicate';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { type ProductsFilters } from '@/types/filters';
import type { SortValue } from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

export function AdminProducts() {
  const navigate = useNavigate();
  const { openConfirmModal } = useConfirmModal();

  const { filters, search, sort, order, setFilters, setSearch, setSort } =
    useAdminProductsStore();

  const {
    currentPage,
    setPage,
    resetPage,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebouncedValue(search.trim(), 500);
  const { duplicateProduct } = useDuplicate();
  const { deleteProduct } = useDeleteAdminProduct();

  const { items, loading, error, totalPages } = useAdminProducts({
    page: currentPage,
    limit: ADMIN_PAGE_LIMIT,
    search: debouncedSearch,
    filters,
    sort,
    order,
  });

  const selectedSortValue = buildSortValue(sort, order);

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  useEffect(() => {
    if (loading) return;

    normalizeOutOfRangePage(totalPages);
  }, [loading, normalizeOutOfRangePage, totalPages]);

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters(newFilters);
    resetPage();
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPage();
  };

  const handleSortChange = (value: SortValue) => {
    const nextSort = parseSortValue(value);
    setSort(nextSort.sort, nextSort.order);
    resetPage();
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleCreateProduct = () => {
    navigate(ROUTES.ADMIN_PRODUCT_CREATE);
  };

  const handleDeleteProduct = (id: string) => {
    openConfirmModal({
      title: 'Delete Product',
      description: 'Are you sure you want to delete this product?',
      isCritical: true,
      confirmText: 'Delete',
      onConfirm: () => deleteProduct(id),
    });
  };

  return (
    <div>
      <AdminPageHeader />

      <div className="flex items-center justify-between px-4 pt-6">
        <div className="flex items-center">
          <Button
            variant="outline"
            onClick={() => setShowFilters((prev) => !prev)}
            className="flex items-center gap-2 !border-gray-300 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
          >
            <ListFilter className="h-5 w-5" />
            Filters
          </Button>

          <Button
            className="ml-3 bg-blue-800 text-white hover:bg-transparent hover:text-blue-800"
            variant="primary"
            onClick={handleCreateProduct}
          >
            + Add Product
          </Button>
        </div>

        <div className="flex items-center justify-end gap-4 p-4">
          <SortProductsDropdown
            value={selectedSortValue}
            onChange={handleSortChange}
          />

          <SearchInput value={search} onChange={handleSearchChange} />
        </div>
      </div>

      {showFilters && (
        <div className="border-b border-[#e5e7eb] bg-gray-50 px-4 py-3 text-gray-700">
          <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>
      )}

      <div className="mx-2 my-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] pb-4 shadow-md md:mx-5">
        <TableProducts
          items={items}
          loading={loading}
          error={error}
          onDelete={handleDeleteProduct}
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
