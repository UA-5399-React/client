import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import type { Category } from '@/types/category.types';

import { CategoryForm } from '../../../components/CategoryForm/CategoryForm';

export const EditCategory = () => {
  const { id } = useParams<{ id: string }>();

  const [category, setCategory] = useState<Category | null>(null);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [categoryResponse, allCategoriesResponse] = await Promise.all([
          fetch(`http://localhost:5000/api/categories/${id}`),
          fetch(`http://localhost:5000/api/categories`),
        ]);

        if (!categoryResponse.ok || !allCategoriesResponse.ok) {
          throw new Error('Failed to fetch data from the server');
        }

        const categoryData = await categoryResponse.json();
        const allData = await allCategoriesResponse.json();

        setCategory(categoryData);
        setAllCategories(allData);
      } catch (err) {
        console.error('Fetch error:', err);
        setError(
          err instanceof Error ? err.message : 'An unknown error occurred',
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="animate-pulse text-lg font-medium text-gray-500">
          Loading category details...
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-xl font-bold text-red-600">Error</h2>
          <p className="text-gray-600">{error || 'Category not found'}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 text-sm text-blue-500 underline"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <CategoryForm mode="edit" initialData={category} items={allCategories} />
  );
};
