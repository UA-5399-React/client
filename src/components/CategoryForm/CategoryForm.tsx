import { useEffect, useRef, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import clsx from 'clsx';
import { ChevronDown, Pencil, Plus, X } from 'lucide-react';
import { z } from 'zod';

import { Input } from '@/components/Input';
import { ROUTES } from '@/constants';
import { useCreateAdminCategory } from '@/hooks/useCreateAdminCategory';
import { useTheme } from '@/hooks/useTheme';
import { useUpdateAdminCategory } from '@/hooks/useUpdateAdminCategory';
import type { Category, Product } from '@/types';

const categorySchema = z.object({
  title: z.string().trim().min(1, 'Category name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  parent: z.string().nullable().optional(),
  imageUrl: z.string().optional().or(z.literal('')),
});

type CategoryFormData = z.infer<typeof categorySchema>;

interface CategoryFormProps {
  mode: 'add' | 'edit';
  initialData?: Category & { products?: Product[] };
  items?: Category[];
}

export const CategoryForm = ({
  mode,
  initialData,
  items = [],
}: CategoryFormProps) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const isEdit = mode === 'edit';

  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    values: {
      title: initialData?.title || '',
      description: initialData?.description || '',
      parent: initialData?.parent || null,
      imageUrl: initialData?.imageUrl || undefined,
    },
  });

  const preview = useWatch({ control, name: 'imageUrl' });
  const parentValue = useWatch({ control, name: 'parent' });

  const { createCategory } = useCreateAdminCategory();
  const { updateCategory } = useUpdateAdminCategory();

  const products = initialData?.products || [];
  const hasChildren =
    isEdit && items.some((item) => item.parent === initialData?.id);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRemoveImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setValue('imageUrl', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const onSubmit = async (data: CategoryFormData) => {
    setServerError(null);

    const depth: 1 | 2 = data.parent ? 2 : 1;

    const payload = {
      title: data.title,
      description: data.description,
      parent: data.parent || undefined,
      imageUrl: data.imageUrl || undefined,
      depth,
    };

    try {
      if (isEdit && initialData?.id) {
        await updateCategory(initialData.id, payload);
      } else {
        await createCategory(payload);
      }
      navigate(ROUTES.ADMIN_CATEGORIES);
    } catch (error) {
      setServerError('Failed to save category. Please try again later.');
      console.error('Save error:', error);
    }
  };

  const inputBaseStyles = clsx(
    'block w-full box-border rounded-lg border border-[#e5e7eb] px-4 py-2.5 text-sm transition-all font-sans',
    'outline-none focus:outline-none focus:ring-0 focus:border-[#38CB89]',
    isDark
      ? 'bg-gray-800 text-white border-gray-700'
      : 'bg-white text-[#1A1C1E]',
  );

  const labelStyles =
    'mb-1.5 block w-full text-[13px] font-semibold text-[#1A1C1E] font-sans';

  return (
    <div
      className={clsx(
        'flex min-h-screen items-center justify-center p-4 font-sans',
        isDark ? 'bg-black' : 'bg-[#F9FAFB]',
      )}
    >
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={clsx(
          'relative w-full rounded-2xl border border-[#e5e7eb] bg-white shadow-sm transition-all duration-300',
          isEdit ? 'max-w-[720px]' : 'max-w-[580px]',
          isDark && 'border-gray-800 bg-[#111827]',
        )}
      >
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-8 py-5">
          <h1 className="text-2xl font-bold text-[#1A1C1E]">
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer border-none bg-transparent text-gray-400 transition-colors hover:text-gray-600"
          >
            <X size={26} strokeWidth={1.5} />
          </button>
        </div>

        <div className="space-y-8 p-8">
          <div className="flex w-full flex-col items-center">
            <label className="mb-4 w-full text-left text-[11px] font-bold tracking-wider text-[#8A92A6] uppercase">
              Category Image
            </label>
            <div
              onClick={() => fileInputRef.current?.click()}
              className="group relative flex h-36 w-48 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-[#e5e7eb] bg-[#F9FAFB] transition-all hover:border-[#38CB89]"
            >
              {preview ? (
                <>
                  <img
                    src={preview}
                    className="h-full w-full rounded-xl object-cover"
                    alt="Preview"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute -top-3 -right-3 flex h-7 w-7 items-center justify-center rounded-full border border-[#e5e7eb] bg-white text-[#F25F5F] shadow-md transition-colors hover:bg-red-50"
                  >
                    <X size={16} strokeWidth={3} />
                  </button>
                  <div className="absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                    <Pencil className="text-white" size={24} />
                    <span className="mt-1 text-[10px] font-bold text-white uppercase">
                      Change
                    </span>
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center text-gray-400">
                  <Plus size={32} strokeWidth={1.2} />
                  <span className="mt-1 text-[10px] font-bold uppercase">
                    Upload
                  </span>
                </div>
              )}
            </div>

            {errors.imageUrl && (
              <p className="mt-2 text-xs text-red-500">
                {errors.imageUrl.message}
              </p>
            )}

            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setValue('imageUrl', URL.createObjectURL(file));
              }}
            />
          </div>

          <div
            className={clsx(
              'grid w-full gap-6',
              isEdit ? 'grid-cols-2' : 'grid-cols-1',
            )}
          >
            <div className={isEdit ? 'col-span-1' : 'w-full'}>
              <label htmlFor="category-name" className={labelStyles}>
                Category Name <span className="text-red-500">*</span>
              </label>

              <Input
                id="category-name"
                placeholder="Category title"
                {...register('title')}
                state={errors.title ? 'error' : 'default'}
                helperText={errors.title?.message}
                inputClassName={clsx(
                  inputBaseStyles,
                  '!outline-none !ring-0 focus:!border-[#38CB89] focus-visible:!ring-0 focus-visible:!outline-none',
                  errors.title && '!border-red-500',
                )}
              />
            </div>

            {!isEdit && (
              <div className="w-full">
                <label className={labelStyles}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={clsx(
                    inputBaseStyles,
                    'h-11 min-h-[44px] resize-none',
                    errors.description && 'border-red-500',
                  )}
                  placeholder="Short description"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}

            <div
              className={clsx('relative', isEdit ? 'col-span-1' : 'w-full')}
              ref={dropdownRef}
            >
              <label className={labelStyles}>Level</label>
              <div
                onClick={() =>
                  !hasChildren && setIsDropdownOpen(!isDropdownOpen)
                }
                className={clsx(
                  inputBaseStyles,
                  'flex cursor-pointer items-center justify-between',
                  isDropdownOpen && 'border-[#38CB89]',
                  hasChildren && 'cursor-not-allowed bg-gray-50 opacity-70',
                )}
              >
                <span
                  className={clsx(
                    'truncate',
                    parentValue ? 'text-[#1A1C1E]' : 'text-gray-400',
                  )}
                >
                  {parentValue
                    ? items.find((c) => String(c.id) === String(parentValue))
                        ?.title
                    : 'Parent Category'}
                </span>
                <ChevronDown
                  size={18}
                  className={clsx(
                    'text-gray-400 transition-transform',
                    isDropdownOpen && 'rotate-180',
                  )}
                />
              </div>
              {isDropdownOpen && (
                <div className="animate-in fade-in zoom-in absolute left-0 z-[100] mt-1 w-full rounded-xl border border-[#e5e7eb] bg-white p-1 shadow-2xl duration-150">
                  <div className="max-h-60 overflow-y-auto">
                    <div
                      onClick={() => {
                        setValue('parent', null);
                        setIsDropdownOpen(false);
                      }}
                      className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm hover:bg-[#F2F4F6]"
                    >
                      <span className="font-medium text-[#1A1C1E]">
                        None (Top Level)
                      </span>
                      {!parentValue && (
                        <div className="h-2 w-2 rounded-full bg-[#38CB89]" />
                      )}
                    </div>
                    {items
                      .filter((c) => c.id !== initialData?.id)
                      .map((c) => (
                        <div
                          key={c.id}
                          onClick={() => {
                            setValue('parent', c.id);
                            setIsDropdownOpen(false);
                          }}
                          className="flex cursor-pointer items-center justify-between rounded-lg px-4 py-3 text-sm hover:bg-[#F2F4F6]"
                        >
                          <span className="font-medium text-[#1A1C1E]">
                            {c.title}
                          </span>
                          {parentValue === c.id && (
                            <div className="h-2 w-2 rounded-full bg-[#38CB89]" />
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>

            {isEdit && (
              <div className="col-span-2">
                <label className={labelStyles}>
                  Description <span className="text-red-500">*</span>
                </label>
                <textarea
                  className={clsx(
                    inputBaseStyles,
                    'h-11 min-h-[44px] resize-none',
                    errors.description && 'border-red-500',
                  )}
                  placeholder="Short description"
                  {...register('description')}
                />
                {errors.description && (
                  <p className="mt-1 text-xs text-red-500">
                    {errors.description.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {isEdit && (
            <div className="w-full border-t border-gray-50 pt-4">
              <label className={labelStyles}>Products Review</label>
              {products.length > 0 ? (
                <div className="scrollbar-hide mt-2 flex gap-3 overflow-x-auto pb-2">
                  {products.slice(0, 3).map((product: Product) => (
                    <div
                      key={product.id}
                      className="flex min-w-[180px] items-center gap-3 rounded-xl border border-[#e5e7eb] bg-white p-2"
                    >
                      <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                        {product.imageUrl && (
                          <img
                            src={product.imageUrl}
                            className="h-full w-full object-cover"
                            alt=""
                          />
                        )}
                      </div>
                      <div className="flex flex-col overflow-hidden">
                        <span className="truncate text-[10px] font-bold uppercase">
                          {product.title || 'Product Name'}
                        </span>
                        <span className="text-[9px] text-[#8A92A6]">
                          ${product.price || '0'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {products.length > 3 && (
                    <button className="flex min-w-[80px] cursor-pointer items-center justify-center rounded-xl border border-dashed border-[#e5e7eb] bg-transparent text-[10px] font-bold text-[#8A92A6] transition-colors hover:bg-gray-50">
                      + {products.length - 3} more
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-2 text-[11px] text-[#8A92A6] italic">
                  No products linked yet.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-6 rounded-b-2xl border-t border-[#e5e7eb] bg-[#F2F4F6]/50 px-8 py-5">
          {serverError && (
            <p className="animate-in fade-in slide-in-from-left-2 mr-auto text-sm font-medium text-red-500">
              {serverError}
            </p>
          )}
          <button
            onClick={() => navigate(-1)}
            className="cursor-pointer border-none bg-transparent text-sm font-bold text-[#8A92A6] transition-colors hover:text-[#1A1C1E]"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-xl border-none bg-[#38CB89] px-8 py-3 text-sm font-bold text-white shadow-sm transition-all hover:bg-[#32b87a] active:scale-95"
          >
            {isEdit ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  );
};
