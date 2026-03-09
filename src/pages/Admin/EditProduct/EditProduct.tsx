import { useState } from 'react';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useMutation } from '@apollo/client/react';

import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { UPDATE_PRODUCT } from '@/services/graphql/productAdminService';
import { GET_PRODUCTS_PAGE } from '@/services/graphql/productAdminService';
import type { ProductFormData } from '@/types';

// Temporary mock data to render the form
const MOCK_INITIAL_DATA: Partial<ProductFormData> = {
  name: 'Test Product',
  price: '200',
  categories: 'laptops, electronics',
  description: 'This is a mock description waiting for the fetch task.',
  imagePreview: null,
};

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const [updateProduct, { loading }] = useMutation(UPDATE_PRODUCT, {
    onCompleted: () => {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    },
    refetchQueries: [
      { query: GET_PRODUCTS_PAGE, variables: { page: 1, limit: 12 } },
    ],
    onError: (error: Error) => {
      alert(`Error updating product: ${error.message}`);
    },
  });

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;
  }

  const handleUpdate = async (formData: ProductFormData) => {
    try {
      await updateProduct({
        variables: {
          id,
          input: {
            title: formData.name,
            price: Number(formData.price),
            description: formData.description,
            tags: formData.categories.split(',').map((c) => c.trim()),
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      {showSuccess && (
        <div className="mb-4 rounded bg-green-100 p-3 text-green-700">
          Product updated successfully!
        </div>
      )}
      <ProductForm
        initialData={MOCK_INITIAL_DATA}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
        isLoading={loading}
      />
    </div>
  );
};
