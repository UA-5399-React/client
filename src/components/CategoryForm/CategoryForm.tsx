import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ChevronDown, Plus, X } from 'lucide-react';

import { useTheme } from '@/hooks/useTheme';
import type { Category } from '@/types/category.types';

interface CategoryFormProps {
  mode: 'add' | 'edit';
  initialData?: Category;
  items?: Category[];
}

export const CategoryForm = ({
  mode,
  initialData,
  items = [],
}: CategoryFormProps) => {
  const navigate = useNavigate();
  const { isDark } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [preview, setPreview] = useState(initialData?.imageUrl || null);
  const [parentValue, setParentValue] = useState(initialData?.parent || '');

  const isEdit = mode === 'edit';
  const hasChildren =
    isEdit && items.some((item) => item.parent === initialData?.id);

  const handleSubmit = async () => {
    const depth = parentValue ? 2 : 1;
    const payload = {
      title,
      description,
      parent: parentValue || null,
      depth,
      imageUrl: preview,
    };
    console.log('Saving Category:', payload);
  };

  // Стилі для полів: висота однакова (h-11 або py-2.5)
  const inputBaseStyles = clsx(
    'w-full rounded-lg border border-[#e5e7eb] px-4 py-2.5 text-sm transition-all outline-none font-sans appearance-none',
    isDark
      ? 'bg-gray-800 text-white border-gray-700 focus:border-[#38CB89]'
      : 'bg-white text-[#1A1C1E] focus:border-[#38CB89]',
  );

  const labelStyles =
    'mb-1.5 block text-[11px] font-bold uppercase tracking-wider text-[#8A92A6] font-sans';

  return (
    <div
      className={clsx(
        'flex min-h-screen items-center justify-center p-4 font-sans transition-colors',
        isDark ? 'bg-black' : 'bg-[#F9FAFB]',
      )}
    >
      <div
        className={clsx(
          'w-full max-w-[560px] overflow-hidden rounded-2xl border border-[#e5e7eb] shadow-sm',
          isDark ? 'border-gray-800 bg-[#111827]' : 'bg-white',
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#e5e7eb] px-8 py-5">
          <h1
            className={clsx(
              'text-xl font-bold tracking-tight',
              isDark ? 'text-white' : 'text-[#1A1C1E]',
            )}
          >
            {isEdit ? 'Edit Category' : 'Add Category'}
          </h1>
          <button
            onClick={() => navigate(-1)}
            className="text-[#8A92A6] transition-colors hover:text-gray-400"
          >
            <X size={22} />
          </button>
        </div>

        <div className="space-y-6 p-8">
          {/* Image Upload Area */}
          <div className="flex flex-col items-center">
            <span className={labelStyles}>Category Image</span>
            <div
              onClick={() => fileInputRef.current?.click()}
              className={clsx(
                'group relative flex h-32 w-44 cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed transition-all',
                isDark
                  ? 'border-gray-700 bg-gray-800 hover:border-[#38CB89]'
                  : 'border-[#e5e7eb] bg-[#F9FAFB] hover:border-[#38CB89]',
              )}
            >
              {preview ? (
                <img
                  src={preview}
                  className="h-full w-full rounded-xl object-cover p-1"
                  alt="Preview"
                />
              ) : (
                <div className="flex flex-col items-center text-[#8A92A6]">
                  <Plus
                    size={28}
                    className="mb-1 transition-transform group-hover:scale-110"
                  />
                  <span className="text-[10px] font-bold tracking-widest uppercase">
                    Upload
                  </span>
                </div>
              )}
            </div>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setPreview(URL.createObjectURL(file));
              }}
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-5">
            <div>
              <label className={labelStyles}>Category Name *</label>
              <input
                className={inputBaseStyles}
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyles}>Description</label>
              <textarea
                className={clsx(
                  inputBaseStyles,
                  'h-11 min-h-[44px] resize-none overflow-hidden',
                )}
                placeholder="Brief description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div>
              <label className={labelStyles}>Parent Category</label>
              <div className="relative">
                <select
                  value={parentValue || ''}
                  onChange={(e) => setParentValue(e.target.value)}
                  disabled={hasChildren}
                  className={clsx(
                    inputBaseStyles,
                    'pr-10',
                    hasChildren && 'cursor-not-allowed bg-gray-50 opacity-50',
                  )}
                >
                  <option value="">Parent Category</option> {/* Змінено тут */}
                  {items
                    .filter(
                      (cat) => cat.depth === 1 && cat.id !== initialData?.id,
                    )
                    .map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.title}
                      </option>
                    ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-[#8A92A6]">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className={clsx(
            'flex items-center justify-end gap-3 border-t border-[#e5e7eb] px-8 py-5',
            isDark ? 'bg-gray-800/30' : 'bg-[#F9FAFB]',
          )}
        >
          <button
            onClick={() => navigate(-1)}
            className="rounded-lg border border-[#e5e7eb] bg-white px-5 py-2 text-sm font-bold text-[#8A92A6] shadow-sm transition-all hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-lg border-none bg-[#38CB89] px-7 py-2 text-sm font-bold text-white shadow-sm transition-all outline-none hover:bg-[#32b87a] active:scale-[0.98]"
          >
            {isEdit ? 'Update Category' : 'Save Category'}
          </button>
        </div>
      </div>
    </div>
  );
};
