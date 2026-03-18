import { useNavigate } from 'react-router-dom';

import {
  AdminPageHeader,
  Button,
  Pagination,
  SearchInput,
  TableCategories,
} from '@/components';
import { useAdminCategories } from '@/hooks/useAdminCategories';

export function AdminCategories() {
  const { categories, loading, error } = useAdminCategories();
  const navigate = useNavigate();

  return (
    <div>
      <AdminPageHeader />

      <div className="flex items-center justify-end border-b border-[#e5e7eb] px-4 py-3">
        <Button
          variant="primary"
          type="button"
          onClick={() => navigate('/admin/categories/add')}
        >
          + Add Category
        </Button>
      </div>

      <div className="mx-2 my-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] pb-4 shadow-md md:mx-5">
        <div className="flex items-center justify-end gap-4 border-b border-[#e5e7eb] p-4">
          <div className="flex items-center gap-4">
            <SearchInput value="" onChange={() => {}} placeholder="Search" />
          </div>
        </div>

        <TableCategories items={categories} loading={loading} error={error} />

        <Pagination currentPage={1} totalPages={5} onPageChange={() => {}} />
      </div>
    </div>
  );
}
