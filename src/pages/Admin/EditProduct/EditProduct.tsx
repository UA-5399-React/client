import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';

import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import {
  GET_PRODUCTS_PAGE,
  UPDATE_PRODUCT,
} from '@/services/graphql/productAdminService';
import type { ProductFormData } from '@/types';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [showSuccess, setShowSuccess] = useState(false);

  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT, {
    refetchQueries: [
      { query: GET_PRODUCTS_PAGE, variables: { limit: 10, page: 1 } },
    ],
    onCompleted: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    onError: (error: Error) => {
      alert(`Error while saving: ${error.message}`);
    },
  });

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;
  }

  // Temporary mock data to render the form
  const mockInitialData: Partial<ProductFormData> = {
    name: 'Test Product',
    price: '200',
    categories: 'laptops, electronics',
    description: 'This is a mock description waiting for the fetch task.',
    imagePreview: null,
  };

  const handleUpdate = async (formData: ProductFormData) => {
    await updateProduct({
      variables: {
        id: id,
        input: {
          title: formData.name,
          price: Number(formData.price),
          description: formData.description,
          tags: formData.categories.split(',').map((tag) => tag.trim()),
        },
      },
    });
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {showSuccess && (
        <div className="mb-4 rounded-md border border-green-200 bg-green-50 p-4 text-green-700 shadow-sm dark:border-green-900/50 dark:bg-green-900/20 dark:text-green-400">
          <div className="flex items-center gap-2">
            <span className="text-lg">✓</span>
            <p className="font-medium">Product updated successfully!</p>
          </div>
        </div>
      )}

      <ProductForm
        initialData={mockInitialData}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
};
