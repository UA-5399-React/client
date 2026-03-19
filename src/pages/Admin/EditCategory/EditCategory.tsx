import { Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { CategoryForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { useGetAdminCategory } from '@/hooks/useGetAdminCategory';
import { useTheme } from '@/hooks/useTheme';

export const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();

  const { category, loading: isCategoryLoading } = useGetAdminCategory(id);

  const { categories, loading: isListLoading } = useAdminCategories();

  if (!id) return <Navigate to={ROUTES.ADMIN_CATEGORIES} replace />;

  const isLoading = isCategoryLoading || isListLoading;

  if (isLoading) {
    return (
      <div
        className={clsx(
          'flex min-h-screen items-center justify-center transition-colors',
          isDark ? 'bg-black' : 'bg-[#F9FAFB]',
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#38CB89]/20 border-t-[#38CB89]"></div>
          <div className="text-sm font-bold tracking-widest text-[#8A92A6] uppercase">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (!category) return null;

  return (
    <div className="mx-auto max-w-3xl p-6">
      <CategoryForm mode="edit" initialData={category} items={categories} />
    </div>
  );
};
