import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/Button';
import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { useGetAdminProduct } from '@/hooks/useGetAdminProduct';
import { useUpdateAdminProduct } from '@/hooks/useUpdateAdminProduct';
import type { ProductFormData } from '@/types';

const ERROR_TEXTS = {
  SERVER: 'Server Error: Failed to load product data',
  NOT_FOUND: 'Product not found',
};

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const {
    product,
    loading: isFetching,
    error: fetchError,
  } = useGetAdminProduct(id);
  const { updateProduct, loading: isUpdating } = useUpdateAdminProduct();

  const initialData = product
    ? {
        name: product.title,
        price: String(product.price),
        description: product.description || '',
        categories: product.categories?.join(', ') || '',
        imagePreview: product.imageUrl || null,
      }
    : null;

  if (!id) return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;

  if (isFetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="text-xl text-gray-400">Loading...</span>
      </div>
    );
  }

  if (fetchError || !initialData) {
    const message = fetchError ? ERROR_TEXTS.SERVER : ERROR_TEXTS.NOT_FOUND;

    return (
      <div className="mx-auto max-w-3xl p-6">
        <div className="flex items-center justify-between rounded bg-red-100 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <span className="text-sm font-medium">{message}</span>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_PRODUCTS)}
            variant="outline"
            className="flex h-8 items-center justify-center border-white bg-red-600 px-4 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700"
          >
            Back to Products
          </Button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (formData: ProductFormData) => {
    try {
      await updateProduct(id, {
        title: formData.name,
        price: Number(formData.price),
        description: formData.description,
        categories: formData.categories.split(',').map((c) => c.trim()),
      });
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {showSuccess && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700 dark:bg-green-900/20 dark:text-green-400">
          Product updated successfully!
        </div>
      )}
      <ProductForm
        initialData={initialData}
        onSubmit={handleSubmit}
        onCancel={() => navigate(ROUTES.ADMIN_PRODUCTS)}
        isLoading={isUpdating}
      />
    </div>
  );
};
