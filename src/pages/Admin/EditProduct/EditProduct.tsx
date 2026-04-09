import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { AdminPageHeader } from '@/components';
import { Button } from '@/components/Button';
import { ProductForm } from '@/components/ProductForm';
import { ROUTES } from '@/constants';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useGetAdminProduct } from '@/hooks/useGetAdminProduct';
import { useUpdateAdminProduct } from '@/hooks/useUpdateAdminProduct';
import { useUploadProductImage } from '@/hooks/useUploadProductImage';
import { useErrorStore } from '@/store/errorStore';
import type { ProductFormData, ProductStatus } from '@/types';

const ERROR_TEXTS = {
  SERVER: 'Server Error: Failed to load product data',
  NOT_FOUND: 'Product not found',
};

export const EditProduct = () => {
  useErrorMessage();

  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const showMessage = useErrorStore((s) => s.show);

  const {
    product,
    loading: isFetching,
    error: fetchError,
  } = useGetAdminProduct(id);
  const { updateProduct, loading: isUpdating } = useUpdateAdminProduct();
  const { uploadImage, loading: isUploading } = useUploadProductImage();

  const initialData = product
    ? {
        name: product.title,
        price: String(product.price),
        description: product.description || '',
        categories: product.categories?.join(', ') || '',
        status: product.status,
        imagePreview: product.imageUrl || null,
        updatedAt: product.updatedAt,
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
      let uploadedImage;

      if (formData.imageFile) {
        uploadedImage = await uploadImage(formData.imageFile);
      }

      await updateProduct(id, {
        title: formData.name,
        price: Number(formData.price),
        status: formData.status as ProductStatus,
        description: formData.description,
        categories: formData.categories.split(',').map((c) => c.trim()),
        ...(uploadedImage && {
          imageUrl: uploadedImage.imageUrl,
          imagePublicId: uploadedImage.imagePublicId,
        }),
      });

      navigate(ROUTES.ADMIN_PRODUCTS, {
        state: {
          successMessage: 'Product updated successfully',
        },
      });
    } catch (e) {
      showMessage(
        'error',
        'Update failed',
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
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          isLoading={isUpdating || isUploading}
          isEditMode={true}
          updatedAt={product?.updatedAt}
        />
      </div>
    </div>
  );
};
