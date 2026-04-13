import { useNavigate } from 'react-router-dom';

import { AdminPageHeader } from '@/components';
import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { useCreateAdminProduct } from '@/hooks/useCreateAdminProduct';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useUploadProductImage } from '@/hooks/useUploadProductImage';
import { useErrorStore } from '@/store/errorStore';
import type { ProductFormData } from '@/types';

export const CreateProduct = () => {
  useErrorMessage();
  const navigate = useNavigate();
  const { createProduct, loading } = useCreateAdminProduct();
  const { uploadImage, loading: isUploading } = useUploadProductImage();
  const showMessage = useErrorStore((s) => s.show);

  const handleCreate = async (formData: ProductFormData) => {
    try {
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
      navigate(ROUTES.ADMIN_PRODUCTS, {
        state: {
          successMessage: 'Product created successfully',
        },
      });
    } catch (e) {
      showMessage(
        'error',
        'Product creation failed',
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_PRODUCTS, {
      state: {
        errorMessage: 'Creation cancelled',
      },
    });
  };

  return (
    <div>
      <AdminPageHeader />
      <div className="mx-auto max-w-3xl p-6">
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
