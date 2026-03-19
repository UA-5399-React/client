import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import clsx from 'clsx';
import { AlertCircle } from 'lucide-react';

import {
  AdminPageHeader,
  Button,
  Pagination,
  SearchInput,
  TableCategories,
} from '@/components';
import { useDeleteAdminCategory } from '@/hooks';
import { useAdminCategoriesPage } from '@/hooks/useAdminCategoriesPage';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types';

const LIMIT = 10;

export function AdminCategories() {
  const { isDark } = useTheme();
  const { openConfirmModal } = useConfirmModal();
  const { deleteCategory } = useDeleteAdminCategory();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const pageFromParams = Number(searchParams.get('page'));
  const currentPage =
    Number.isInteger(pageFromParams) && pageFromParams > 0 ? pageFromParams : 1;
  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { categories, loading, error, totalPages, total } =
    useAdminCategoriesPage({
      page: currentPage,
      limit: LIMIT,
      search: debouncedSearch,
    });

  const updateSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        updater(next);
        return next;
      });
    },
    [setSearchParams],
  );

  const handlePageChange = (nextPage: number) => {
    updateSearchParams((next) => {
      next.set('page', String(nextPage));
    });
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    updateSearchParams((next) => {
      next.set('page', '1');
    });
  };

  useEffect(() => {
    if (!loading && currentPage > 1 && total > 0 && categories.length === 0) {
      updateSearchParams((next) => {
        next.set('page', '1');
      });
    }
  }, [categories.length, currentPage, loading, total, updateSearchParams]);

  const handleDeleteCategory = (category: Category) => {
    setDeleteError(null);

    openConfirmModal({
      title: 'Delete Category',
      description: `Delete category "${category.title}"? Products will remain without this category.`,
      isCritical: true,
      confirmText: 'Delete',
      onConfirm: async () => {
        try {
          setDeletingId(category.id);
          await deleteCategory(category.id);
        } catch (error) {
          setDeleteError(
            error instanceof Error
              ? error.message
              : 'Failed to delete category',
          );
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  return (
    <div>
      <AdminPageHeader />

      <div className="flex items-center justify-end border-b border-[#e5e7eb] px-4 py-3">
        <Button variant="primary" type="button">
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

        {deleteError ? (
          <div className="px-5 pt-5">
            <div
              className={clsx(
                'mx-auto flex max-w-md items-center gap-3 rounded-lg border p-4',
                {
                  'border-red-900/50 bg-red-950/30 text-red-300': isDark,
                  'border-red-200 bg-red-50 text-red-800': !isDark,
                },
              )}
              role="alert"
            >
              <AlertCircle className="h-6 w-6 shrink-0" />
              <div className="text-left">
                <p className="font-medium">Failed to delete category</p>
                <p className="text-sm">{deleteError}</p>
              </div>
            </div>
          </div>
        ) : null}

        <TableCategories
          items={categories}
          loading={loading}
          error={error}
          deletingId={deletingId}
          onDelete={handleDeleteCategory}
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
