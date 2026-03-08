import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import type { ProductFormData } from '@/types';

export const EditProduct = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

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

  // TODO: Task #84 - Implement GraphQL mutation for updating product
  const handleUpdate = async (formData: ProductFormData) => {
    console.log('Editing product ID:', id);
    console.log('New data:', formData);
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <ProductForm
        initialData={mockInitialData}
        onSubmit={handleUpdate}
        onCancel={handleCancel}
      />
    </div>
  );
};
