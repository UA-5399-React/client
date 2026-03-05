import { useNavigate } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useCreateAdminProduct } from '@/hooks/useCreateAdminProduct';
import {
  ProductForm,
  type ProductFormData,
} from '@/pages/ProductForm/ProductForm';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct } = useCreateAdminProduct();

  const handleCreate = async (formData: ProductFormData) => {
    try {
      //TODO: temporary solution for image, you can replace it with actual image upload logic
      const dummyImageUrl =
        'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800&h=1200&fit=crop';
      const input = {
        title: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        tags: formData.categories
          ? formData.categories
              .split(',')
              .map((tag) => tag.trim())
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
      <ProductForm onSubmit={handleCreate} onCancel={handleCancel} />
    </div>
  );
};
