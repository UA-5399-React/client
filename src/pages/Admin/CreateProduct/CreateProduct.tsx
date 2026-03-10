import { useNavigate } from 'react-router-dom';

import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { useCreateAdminProduct } from '@/hooks/useCreateAdminProduct';
import type { ProductFormData, ProductStatus } from '@/types';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useCreateAdminProduct();

  const handleCreate = async (formData: ProductFormData) => {
    try {
      //TODO: temporary solution for image, you can replace it with actual image upload logic
      const dummyImageUrl =
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=1200&fit=crop';
      const input = {
        title: formData.name,
        price: parseFloat(formData.price),
        status: 'DRAFT' as ProductStatus,
        description: formData.description,
        categories: formData.categories
          ? formData.categories
              .split(',')
              .map((category) => category.trim())
              .filter(Boolean)
          : [],
        imageUrl: dummyImageUrl,
      };

      await createProduct(input);
      navigate(ROUTES.ADMIN_PRODUCTS);
    } catch (err) {
      console.error('Error creating product:', err);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div className="mx-auto max-w-3xl p-6">
      <ProductForm
        onSubmit={handleCreate}
        onCancel={handleCancel}
        isLoading={loading}
        isEditMode={false}
      />
    </div>
  );
};
