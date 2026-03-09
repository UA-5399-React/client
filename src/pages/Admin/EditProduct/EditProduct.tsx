import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
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

  if (!id) {
    return <Navigate to={ROUTES.ADMIN_PRODUCTS} replace />;
  }

  const handleUpdate = async (formData: ProductFormData) => {
    void formData;
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <ProductForm
        initialData={MOCK_INITIAL_DATA}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
};
