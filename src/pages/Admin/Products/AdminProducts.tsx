import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ListFilter } from 'lucide-react';

import {
  AdminPageHeader,
  Button,
  ExportButton,
  ImportProductsModal,
  Pagination,
  ProductFiltersBar,
  SearchInput,
  SortProductsDropdown,
  TableProducts,
} from '@/components';
import { ADMIN_PAGE_LIMIT, EXPORT_TYPES, ROUTES } from '@/constants';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useDeleteAdminProduct } from '@/hooks/useDeleteAdminProduct';
import { useDuplicate } from '@/hooks/useDuplicate';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import { useAdminProductsStore } from '@/store/useAdminProductsStore';
import { PRODUCT_STATUS } from '@/types';
import { type ProductsFilters } from '@/types/filters';
import type {
  ProductSortField,
  SortOrder,
  SortValue,
} from '@/types/productsSort';
import { buildSortValue, parseSortValue } from '@/utils/sorting';

const VALID_SORT_FIELDS: ProductSortField[] = [
  'updatedAt',
  'createdAt',
  'price',
  'title',
  'purchaseCount',
];

const VALID_SORT_ORDERS: SortOrder[] = ['asc', 'desc'];

export function AdminProducts() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { openConfirmModal } = useConfirmModal();

  useErrorMessage();

  const {
    filters,
    search,
    sort,
    order,
    selectedIds,
    setFilters,
    setSearch,
    setSort,
    toggleSelect,
    selectAll,
    clearSelection,
  } = useAdminProductsStore();

  const {
    currentPage,
    setPage,
    resetPage,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  const [showFilters, setShowFilters] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

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
    return () => clearSelection();
  }, []);

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  useEffect(() => {
    if (loading) return;

    normalizeOutOfRangePage(totalPages);
  }, [loading, normalizeOutOfRangePage, totalPages]);

  useEffect(() => {
    const sortBy = searchParams.get('sortBy');
    const orderParam = searchParams.get('order');

    if (
      sortBy &&
      orderParam &&
      VALID_SORT_FIELDS.includes(sortBy as ProductSortField) &&
      VALID_SORT_ORDERS.includes(orderParam as SortOrder)
    ) {
      if (sort !== sortBy || order !== orderParam) {
        setSort(sortBy as ProductSortField, orderParam as SortOrder);
      }
      return;
    }

    if (sort !== 'updatedAt' || order !== 'desc') {
      setSort('updatedAt', 'desc');
    }
  }, [searchParams, sort, order, setSort]);

  const updateSortParams = (
    nextSort: ProductSortField,
    nextOrder: SortOrder,
  ) => {
    const params = new URLSearchParams();

    params.set('page', '1');
    params.set('sortBy', nextSort);
    params.set('order', nextOrder);

    setSearchParams(params);
  };

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

    updateSortParams(nextSort.sort, nextSort.order);
  };

  const handleTableSortChange = (field: ProductSortField) => {
    const nextOrder: SortOrder =
      sort === field && order === 'asc' ? 'desc' : 'asc';

    updateSortParams(field, nextOrder);
  };

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
    clearSelection();
  };

  const handleCreateProduct = () => {
    navigate(ROUTES.ADMIN_PRODUCT_CREATE);
  };

  const handleRowClick = (id: string) => {
    navigate(`/product/${id}`);
  };

  const handleDeleteProduct = (id: string) => {
    const isBulk = selectedIds.includes(id) && selectedIds.length > 1;
    const draftIds = isBulk
      ? items
          .filter(
            (item) =>
              selectedIds.includes(item.id) &&
              item.status.toUpperCase() === PRODUCT_STATUS.DRAFT,
          )
          .map((item) => item.id)
      : [id];

    if (isBulk && draftIds.length === 0) return;

    const description = isBulk
      ? `Delete ${draftIds.length} draft product${draftIds.length !== 1 ? 's' : ''}?${
          selectedIds.length > draftIds.length
            ? ` (${selectedIds.length - draftIds.length} non-draft will be skipped)`
            : ''
        }`
      : 'Are you sure you want to delete this product?';

    openConfirmModal({
      title: isBulk ? 'Delete Selected' : 'Delete Product',
      description,
      isCritical: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        if (isBulk) {
          await Promise.all(draftIds.map((draftId) => deleteProduct(draftId)));
          clearSelection();
        } else {
          await deleteProduct(id);
          navigate('.', {
            state: { successMessage: 'Product deleted successfully!' },
          });
        }
      },
    });
  };

  const handleDuplicate = async (id: string) => {
    if (selectedIds.includes(id) && selectedIds.length > 1) {
      openConfirmModal({
        title: 'Duplicate Selected',
        description: `Duplicate ${selectedIds.length} products?`,
        confirmText: 'Duplicate',
        onConfirm: async () => {
          await Promise.all(
            selectedIds.map((selectedId) => duplicateProduct(selectedId)),
          );
          clearSelection();
        },
      });
    } else {
      await duplicateProduct(id);
    }
  };

  return (
    <div className="pb-6">
      {showImportModal && (
        <ImportProductsModal onClose={() => setShowImportModal(false)} />
      )}

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
          <Button
            className="ml-3 border border-gray-300 bg-transparent text-[rgb(var(--color-text))] hover:border-blue-500 hover:text-blue-500"
            onClick={() => setShowImportModal(true)}
          >
            Import
          </Button>
          <ExportButton
            type={EXPORT_TYPES.PRODUCTS}
            filters={filters}
            search={search}
          />{' '}
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

      <div className="mx-2 my-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] pb-6 shadow-md md:mx-5">
        <TableProducts
          items={items}
          loading={loading}
          error={error}
          sort={sort}
          order={order}
          selectedIds={selectedIds}
          onSortChange={handleTableSortChange}
          onDelete={handleDeleteProduct}
          onDuplicate={handleDuplicate}
          onToggleSelect={toggleSelect}
          onSelectAll={selectAll}
          onRowClick={handleRowClick}
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
