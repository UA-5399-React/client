import { useEffect, useState } from 'react';
import clsx from 'clsx'; // Додаємо для зручності темної теми

import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/category.types';

import { CategoryForm } from '../../../components/CategoryForm/CategoryForm';

export const AddCategory = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const { isDark } = useTheme();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:3000/api/categories');
        if (response.ok) {
          const data = await response.json();
          setAllCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div
        className={clsx(
          'flex min-h-screen items-center justify-center transition-colors',
          isDark ? 'bg-black' : 'bg-[#F9FAFB]',
        )}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#38CB89]/20 border-t-[#38CB89]"></div>
          <div
            className={clsx(
              'font-sans text-sm font-bold tracking-widest uppercase',
              isDark ? 'text-gray-500' : 'text-[#8A92A6]',
            )}
          >
            Loading Form...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={clsx(
        'min-h-screen transition-colors',
        isDark ? 'bg-black' : 'bg-[#F9FAFB]',
      )}
    >
      <CategoryForm mode="add" items={allCategories} />
    </div>
  );
};
