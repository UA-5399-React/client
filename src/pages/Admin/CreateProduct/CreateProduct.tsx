import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AdminPageHeader } from '@/components';
import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { useCreateAdminProduct } from '@/hooks/useCreateAdminProduct';
import { useUploadProductImage } from '@/hooks/useUploadProductImage';
import type { ProductFormData } from '@/types';

export const CreateProduct = () => {
  const navigate = useNavigate();
  const { createProduct, loading } = useCreateAdminProduct();
  const { uploadImage, loading: isUploading } = useUploadProductImage();
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleCreate = async (formData: ProductFormData) => {
    try {
      setUploadError(null);
      let uploadedImage;

      if (formData.imageFile) {
        uploadedImage = await uploadImage(formData.imageFile);
      }

      const input = {
        title: formData.name,
        price: parseFloat(formData.price),
        description: formData.description,
        categories: formData.categories
          ? formData.categories
              .split(',')
              .map((c) => c.trim())
              .filter(Boolean)
          : [],
        ...(uploadedImage && {
          imageUrl: uploadedImage.imageUrl,
          imagePublicId: uploadedImage.imagePublicId,
        }),
      };

      await createProduct(input);
      navigate(ROUTES.ADMIN_PRODUCTS);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : 'Error creating product';
      setUploadError(errorMessage);
      console.error('Error creating product:', err);
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS);
  };

  return (
    <div>
      <AdminPageHeader />
      <div className="mx-auto max-w-3xl p-6">
        {uploadError && (
          <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
            {uploadError}
          </div>
        )}
        <ProductForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={loading || isUploading}
          isEditMode={false}
        />
      </div>
    </div>
  );
};
