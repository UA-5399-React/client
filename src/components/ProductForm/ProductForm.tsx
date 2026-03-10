import React, { useEffect, useRef } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Image as ImageIcon } from 'lucide-react';
import { z } from 'zod';

import { Dropdown, Input, TextArea } from '@/components';
import type { ProductFormData, ProductStatus } from '@/types';

import type { DropdownOption } from '../Dropdown/Dropdown.types';

const STATUS_OPTIONS: DropdownOption[] = [
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Inactive', value: 'INACTIVE' },
  { label: 'Draft', value: 'DRAFT' },
];

const productFormSchema = z.object({
  name: z.string().trim().min(1, 'Product name is required'),
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
  description: z.string(),
  imagePreview: z.string().nullable(),
  imageFile: z.instanceof(File).optional(),
});

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
  isLoading,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const previewUrlRef = useRef<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormData>({
    resolver: zodResolver(productFormSchema),
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      name: initialData?.name || '',
      price: initialData?.price || '',
      categories: initialData?.categories || '',
      status: initialData?.status || ('DRAFT' as ProductStatus),
      description: initialData?.description || '',
      imagePreview: initialData?.imagePreview || null,
      imageFile: undefined,
    },
  });

  const imagePreview = useWatch({ control, name: 'imagePreview' });

  useEffect(() => {
    register('imagePreview');
    register('imageFile');
  }, [register]);

  useEffect(() => {
    reset({
      name: initialData?.name || '',
      price: initialData?.price || '',
      categories: initialData?.categories || '',
      status: initialData?.status || ('DRAFT' as ProductStatus),
      description: initialData?.description || '',
      imagePreview: initialData?.imagePreview || null,
      imageFile: undefined,
    });
  }, [initialData, reset]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
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

    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }

    const previewUrl = URL.createObjectURL(file);
    previewUrlRef.current = previewUrl;

    setValue('imageFile', file, { shouldDirty: true, shouldValidate: true });
    setValue('imagePreview', previewUrl, {
      shouldDirty: true,
      shouldValidate: true,
    });
  };

  const handleSave = async (data: ProductFormData) => {
    await onSubmit(data);
  };

  const isDisabled = isLoading || isSubmitting;

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
              <Input
                label="Categories"
                type="text"
                placeholder="Categories"
                inputClassName="bg-white text-black"
                {...field}
                value={field.value ?? ''}
                state={errors.categories ? 'error' : 'default'}
                helperText={errors.categories?.message}
              />
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field }) => (
              <Dropdown
                label="Status"
                labelClassName="capitalize text-sm"
                selectClassName="bg-white text-black hover:bg-gray-50 dark:hover:bg-gray-800 data-[popup-open]:bg-white"
                options={STATUS_OPTIONS}
                selectedValues={field.value ? [field.value] : []}
                onChange={(values) =>
                  field.onChange((values[0]?.value ?? 'DRAFT') as ProductStatus)
                }
                placeholder="Select status"
                multiple={false}
              />
            )}
          />
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

        <div className="mt-4 flex justify-end gap-3">
          <button
            type="submit"
            disabled={isDisabled}
            className={`cursor-pointer rounded-md border-0 bg-green-500 px-5 py-1.5 text-white hover:bg-green-500/90 dark:hover:bg-green-900/20 ${
              isDisabled ? 'cursor-not-allowed opacity-50' : ''
            }`}
          >
            {isDisabled ? 'Saving...' : 'Save'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isDisabled}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
