import { Navigate, useParams } from 'react-router-dom';
import clsx from 'clsx';

import { CategoryForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminCategories } from '@/hooks/useAdminCategories';
import { useGetAdminCategory } from '@/hooks/useGetAdminCategory';
import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/category.types';
import type { Product } from '@/types/product.types';

type CategoryWithProducts = Category & {
  products?: Product[];
};

export const EditCategory = () => {
  const { id } = useParams<{ id: string }>();
  const { isDark } = useTheme();

  const {
    category,
    loading: isCategoryLoading,
    error,
  } = useGetAdminCategory(id);
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

  if (error || !category) return null;

  const categoryWithData = category as CategoryWithProducts;

  const safeInitialData = {
    ...categoryWithData,
    products: Array.isArray(categoryWithData.products)
      ? categoryWithData.products
      : [],
  };

  return (
    <CategoryForm
      mode="edit"
      initialData={safeInitialData}
      items={categories || []}
    />
  );
};
