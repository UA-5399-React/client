import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  AdminPageHeader,
  Button,
  Pagination,
  SearchInput,
  TableCategories,
} from '@/components';
import { useAdminCategoriesPage } from '@/hooks/useAdminCategoriesPage';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';

const LIMIT = 10;

export function AdminCategories() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState('');

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

        <TableCategories items={categories} loading={loading} error={error} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages || 1}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
