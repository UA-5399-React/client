import clsx from 'clsx';

import { CategoryForm } from '@/components';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { useTheme } from '@/hooks/useTheme';

export const AddCategory = () => {
  const { isDark } = useTheme();

  const { categories, loading } = useAdminCategories();

  if (loading) {
    return (
      <div
        className={clsx(
          'flex min-h-screen items-center justify-center',
          isDark ? 'bg-black' : 'bg-[#F9FAFB]',
        )}
      >
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#38CB89]/20 border-t-[#38CB89]"></div>
      </div>
    );
  }

  return (
    <div className={clsx('min-h-screen', isDark ? 'bg-black' : 'bg-[#F9FAFB]')}>
      <CategoryForm mode="add" items={categories} />
    </div>
  );
};
