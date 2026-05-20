import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon, X } from 'lucide-react';
import { z } from 'zod';

import { CategoryDropdown, Dropdown, Input, TextArea } from '@/components';
import { useAdminCategories } from '@/hooks';
import {
  PRODUCT_STATUS,
  type ProductFormData,
  type ProductStatusUpperCase,
} from '@/types';

import type { DropdownOption } from '../Dropdown/Dropdown.types';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
];

const HTML_TAG_REGEX = /<[^>]*>/;

const productFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Product name is required')
    .refine(
      (value) => !HTML_TAG_REGEX.test(value),
      'HTML tags are not allowed',
    ),
  price: z
    .string()
    .trim()
    .min(1, 'Price is required')
    .refine((value) => !Number.isNaN(Number(value)), 'Price must be a number')
    .refine((value) => Number(value) >= 0, 'Price must be at least 0'),
  categories: z
    .string()
    .trim()
    .min(1, 'Categories are required')
    .refine(
      (value) =>
        value
          .split(',')
          .map((category) => category.trim())
          .filter(Boolean).length > 0,
      'Enter at least one category',
    ),
  status: z.enum(['ACTIVE', 'INACTIVE', 'DRAFT']),
  description: z
    .string()
    .refine(
      (value) => !HTML_TAG_REGEX.test(value),
      'HTML tags are not allowed',
    ),
  imagePreview: z.string().nullable(),
  imageFile: z.instanceof(File).optional(),
  additionalImages: z
    .array(
      z.object({
        imageUrl: z.string(),
        imagePublicId: z.string(),
      }),
    )
    .optional(),
  additionalImageFiles: z.array(z.instanceof(File)).optional(),
});

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
  isEditMode?: boolean;
  updatedAt?: string;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
  isEditMode = false,
  updatedAt,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const additionalFileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);
  const additionalPreviewUrlsRef = useRef<Set<string>>(new Set());
  const [additionalImagePreviews, setAdditionalImagePreviews] = useState<
    string[]
  >([]);
  const { categories } = useAdminCategories();
  const categoryOptions = categories.map((c) => ({
    label: c.title,
    value: c.id,
  }));

  const {
    control,
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      categories: Array.isArray(initialData?.categories)
        ? initialData.categories.join(',')
        : initialData?.categories || '',
      status:
        (initialData?.status?.toUpperCase() as ProductStatusUpperCase) ||
        'DRAFT',
      description: initialData?.description || '',
      imagePreview: initialData?.imagePreview || null,
      imageFile: undefined,
      additionalImages: initialData?.additionalImages || [],
    },
  });

  const imagePreview = useWatch({ control, name: 'imagePreview' });
  const existingAdditionalImages =
    useWatch({ control, name: 'additionalImages' }) || [];
  const additionalImageFiles = useWatch({
    control,
    name: 'additionalImageFiles',
  });

  useEffect(() => {
    register('imagePreview');
    register('imageFile');
  }, [register]);

  useEffect(() => {
    additionalPreviewUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    additionalPreviewUrlsRef.current.clear();

    reset({
      name: initialData?.name || '',
      price: initialData?.price || '',
      categories: Array.isArray(initialData?.categories)
        ? initialData.categories.join(',')
        : initialData?.categories || '',
      status:
        (initialData?.status?.toUpperCase() as ProductStatusUpperCase) ||
        'DRAFT',
      description: initialData?.description || '',
      imagePreview: initialData?.imagePreview || null,
      imageFile: undefined,
      additionalImages: initialData?.additionalImages || [],
      additionalImageFiles: undefined,
    });
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      additionalPreviewUrlsRef.current.forEach((url) =>
        URL.revokeObjectURL(url),
      );
      additionalPreviewUrlsRef.current.clear();
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setValue('imageFile', undefined, {
        shouldDirty: true,
        shouldValidate: true,
      });
      return;
    }
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;
    setValue('imageFile', file, { shouldDirty: true, shouldValidate: true });
    setValue('imagePreview', previewUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleAdditionalImagesChange = (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const previewUrls = files.map((file) => {
      const previewUrl = URL.createObjectURL(file);
      additionalPreviewUrlsRef.current.add(previewUrl);
      return previewUrl;
    });

    setAdditionalImagePreviews((previews) => [...previews, ...previewUrls]);
    setValue(
      'additionalImageFiles',
      [...(additionalImageFiles || []), ...files],
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
    e.target.value = '';
  };

  const handleRemoveAdditionalImage = (index: number) => {
    const previewToRemove = additionalImagePreviews[index];
    if (previewToRemove) {
      URL.revokeObjectURL(previewToRemove);
      additionalPreviewUrlsRef.current.delete(previewToRemove);
    }

    const nextFiles = (additionalImageFiles || []).filter(
      (_, fileIndex) => fileIndex !== index,
    );
    setAdditionalImagePreviews((previews) =>
      previews.filter((_, previewIndex) => previewIndex !== index),
    );
    setValue('additionalImageFiles', nextFiles.length ? nextFiles : undefined, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleRemoveExistingAdditionalImage = (index: number) => {
    setValue(
      'additionalImages',
      existingAdditionalImages.filter((_, imageIndex) => imageIndex !== index),
      {
        shouldDirty: true,
        shouldValidate: true,
      },
    );
  };

  const handleSave = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  const isDisabled = isLoading || isSubmitting;

  const availableStatusOptions =
    initialData?.status &&
    initialData.status.toUpperCase() !== PRODUCT_STATUS.DRAFT
      ? STATUS_OPTIONS.filter((opt) => opt.value !== PRODUCT_STATUS.DRAFT)
      : STATUS_OPTIONS;

  const formattedDate = updatedAt
    ? new Date(updatedAt).toLocaleDateString('en-US', {
        month: '2-digit',
        day: '2-digit',
        year: '2-digit',
      })
    : '';
  return (
    <div className="rounded-lg border border-gray-200 bg-[rgb(var(--color-bg-sec))] p-4 shadow-sm dark:border-gray-800">
      <form onSubmit={handleSubmit(handleSave)} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800">
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <ImageIcon className="h-11 w-11 text-gray-400" />
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-md border border-green-500 bg-transparent px-5 py-1.5 text-green-500 hover:border hover:border-green-500/60 dark:hover:bg-green-900/20"
          >
            Choose File
          </button>
          <input
            type="file"
            ref={additionalFileInputRef}
            onChange={handleAdditionalImagesChange}
            accept="image/*"
            multiple
            className="hidden"
          />
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => additionalFileInputRef.current?.click()}
              className="cursor-pointer rounded-md border border-green-500 bg-transparent px-5 py-1.5 text-green-500 hover:border hover:border-green-500/60 dark:hover:bg-green-900/20"
            >
              Add Gallery Photos
            </button>
            {!!additionalImageFiles?.length && (
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {additionalImageFiles.length} selected
              </span>
            )}
          </div>
          {existingAdditionalImages.length > 0 && (
            <div className="flex max-w-xs flex-wrap justify-center gap-2">
              {existingAdditionalImages.map((image, index) => (
                <div
                  key={image.imagePublicId}
                  className="relative h-20 w-20 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800"
                >
                  <img
                    src={image.imageUrl}
                    alt={`Existing gallery photo ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove existing gallery photo ${index + 1}`}
                    onClick={() => handleRemoveExistingAdditionalImage(index)}
                    className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
          {additionalImagePreviews.length > 0 && (
            <div className="flex max-w-xs flex-wrap justify-center gap-2">
              {additionalImagePreviews.map((previewUrl, index) => (
                <div
                  key={previewUrl}
                  className="group relative h-20 w-20 overflow-hidden rounded-lg bg-gray-200 dark:bg-gray-800"
                >
                  <img
                    src={previewUrl}
                    alt={`Gallery preview ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    aria-label={`Remove gallery photo ${index + 1}`}
                    onClick={() => handleRemoveAdditionalImage(index)}
                    className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border border-white/70 bg-black/60 text-white hover:bg-black/80"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Controller
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                label="Name Product"
                placeholder="Name Product"
                {...field}
                inputClassName="bg-white text-black"
                value={field.value ?? ''}
                state={errors.name ? 'error' : 'default'}
                helperText={errors.name?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="price"
            render={({ field }) => (
              <Input
                label="Price"
                type="number"
                placeholder="Price"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.price ? 'error' : 'default'}
                helperText={errors.price?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <CategoryDropdown
                label="Categories"
                options={categoryOptions}
                selectedValues={
                  field.value
                    ? field.value
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean)
                    : []
                }
                placeholder="No category selected"
                required
                error={!!errors.categories}
                helperText={errors.categories?.message}
                onChange={(selected) => {
                  const newValue = selected.map((opt) => opt.value).join(', ');
                  field.onChange(newValue);
                }}
              />
            )}
          />

          {isEditMode && (
            <Controller
              control={control}
              name="status"
              render={({ field }) => (
                <div className="w-full [&>*]:!flex [&>*]:!flex-col [&>*]:!items-start">
                  <Dropdown
                    label="Status"
                    labelClassName="!text-left !text-sm !font-medium !text-tex !normal-case"
                    selectClassName="[--color-bg:255_255_255] [--color-text:20_23_24] [--color-gray-300:209_213_219] hover:[--color-primary:rgb(var(--color-gray-100))] data-[popup-open]:border-[rgb(var(--color-primary))] dark:[--color-bg:31_41_55] dark:[--color-text:255_255_255] dark:[--color-gray-300:75_85_99] dark:hover:[--color-primary:55_65_81] focus-visible:ring-2 focus-visible:ring-[rgb(var(--color-primary))] focus-visible:ring-offset-0"
                    options={availableStatusOptions}
                    selectedValues={field.value ? [field.value] : []}
                    onChange={(values) => {
                      const newValue = values?.[0];
                      if (newValue) {
                        field.onChange(newValue.value || newValue);
                      }
                    }}
                    placeholder="Select status"
                    multiple={false}
                  />
                </div>
              )}
            />
          )}
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <TextArea
                label="Description"
                placeholder="Description"
                className="col-span-1 md:col-span-3"
                textAreaClassName="resize-none text-sm bg-white"
                {...field}
                value={field.value ?? ''}
                state={errors.description ? 'error' : 'default'}
                helperText={errors.description?.message}
              />
            )}
          />
        </div>

        <div className="mt-4 flex items-center justify-between gap-3 max-sm:flex-col">
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {isEditMode && updatedAt && (
              <span>Last Update: {formattedDate}</span>
            )}
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isDisabled}
              className={`cursor-pointer rounded-md border-0 bg-green-500 px-5 py-1.5 text-white hover:bg-green-500/90 ${
                isDisabled ? 'cursor-not-allowed opacity-50' : ''
              }`}
            >
              {isDisabled ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={onCancel}
              disabled={isDisabled}
              className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
