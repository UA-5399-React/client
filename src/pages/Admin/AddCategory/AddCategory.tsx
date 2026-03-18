import { useEffect, useState } from 'react';

import type { Category } from '@/types/category.types';

import { CategoryForm } from '../../../components/CategoryForm/CategoryForm';

export const AddCategory = () => {
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        // We need all categories to allow the user to select a Parent
        const response = await fetch('http://localhost:5000/api/categories');

        if (response.ok) {
          const data = await response.json();
          setAllCategories(data);
        }
      } catch (error) {
        console.error('Failed to fetch categories for the dropdown:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-500">
          Preparing form...
        </div>
      </div>
    );
  }

  return <CategoryForm mode="add" items={allCategories} />;
};
