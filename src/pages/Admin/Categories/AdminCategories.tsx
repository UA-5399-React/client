import { useEffect, useState } from 'react';
import { generatePath, useNavigate } from 'react-router-dom';

import {
  AdminPageHeader,
  Button,
  Pagination,
  SearchInput,
  TableCategories,
} from '@/components';
import { ADMIN_PAGE_LIMIT, ROUTES } from '@/constants';
import { useDeleteAdminCategory } from '@/hooks';
import { useAdminCategoriesPage } from '@/hooks/useAdminCategoriesPage';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import { useErrorStore } from '@/store/errorStore';
import type { Category } from '@/types';

export function AdminCategories() {
  useErrorMessage();
  const { openConfirmModal } = useConfirmModal();
  const { deleteCategory } = useDeleteAdminCategory();
  const [search, setSearch] = useState('');
  //const [deleteError, setDeleteError] = useState<string | null>(null);
  const showMessage = useErrorStore((s) => s.show);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const navigate = useNavigate();

  const {
    currentPage,
    setPage,
    resetPage,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  const debouncedSearch = useDebouncedValue(search.trim(), 500);
  const isSearchActive = debouncedSearch.length > 0;

  const { categories, loading, error, totalPages } = useAdminCategoriesPage({
    page: currentPage,
    limit: ADMIN_PAGE_LIMIT,
    search: debouncedSearch,
  });
  const autoExpandedIds = isSearchActive
    ? Array.from(
        new Set(
          categories
            .filter((category) => Boolean(category.parent))
            .map((category) => category.parent!)
            .filter(Boolean),
        ),
      )
    : [];

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    resetPage();
  };

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  useEffect(() => {
    if (loading) return;

    normalizeOutOfRangePage(totalPages);
  }, [loading, normalizeOutOfRangePage, totalPages]);

  const handleDeleteCategory = (category: Category) => {
    openConfirmModal({
      title: 'Delete Category',
      description: `Delete category "${category.title}"? Products will remain without this category.`,
      isCritical: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          setDeletingId(category.id);
          await deleteCategory(category.id);
          navigate('.', {
            state: {
              successMessage: 'Category deleted successfully!',
            },
          });
        } catch (e) {
          showMessage(
            'error',
            'Category deletion failed',
            e instanceof Error ? e.message : 'Something went wrong',
          );
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const handleEditCategory = (category: Category) => {
    navigate(
      generatePath(ROUTES.ADMIN_CATEGORY_EDIT, {
        id: category.id,
      }),
    );
  };

  return (
    <div>
      <AdminPageHeader />

      <div className="flex items-center justify-end border-b border-[#e5e7eb] px-4 py-3">
        <Button
          className="ml-3 bg-blue-800 text-white hover:bg-transparent hover:text-blue-800"
          variant="primary"
          type="button"
          onClick={() => navigate(ROUTES.ADMIN_CATEGORY_ADD)}
        >
          + Add Category
        </Button>
      </div>

      <div className="mx-2 my-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] pb-4 shadow-md md:mx-5">
        <div className="flex items-center justify-end gap-4 border-b border-[#e5e7eb] p-4">
          <div className="flex items-center gap-4">
            <SearchInput
              value={search}
              onChange={handleSearchChange}
              placeholder="Search"
            />
          </div>
        </div>

        <TableCategories
          items={categories}
          loading={loading}
          error={error}
          autoExpandedIds={autoExpandedIds}
          deletingId={deletingId}
          onDelete={handleDeleteCategory}
          onEdit={handleEditCategory}
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
