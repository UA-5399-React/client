import React, { useRef, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';

import { Input, TextArea } from '@/components';
import type { ProductFormData } from '@/types';

interface ProductFormProps {
  initialData?: Partial<ProductFormData>;
  onSubmit: (data: ProductFormData) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({
  initialData,
  onSubmit,
  onCancel,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(initialData?.name || '');
  const [price, setPrice] = useState(initialData?.price || '');
  const [categories, setCategories] = useState(initialData?.categories || '');
  const [description, setDescription] = useState(
    initialData?.description || '',
  );
  const [imagePreview, setImagePreview] = useState<string | null>(
    initialData?.imagePreview || null,
  );
  const [imageFile, setImageFile] = useState<File | undefined>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, price, categories, description, imagePreview, imageFile });
  };

  return (
    <div className="dark:bg-background rounded-lg border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800">
      <form onSubmit={handleSave} className="flex flex-col gap-4">
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
          {/* TODO: change button to component */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-md border border-green-500 bg-transparent px-5 py-1.5 text-green-500 hover:border hover:border-green-500/60 dark:hover:bg-green-900/20"
          >
            Choose File
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Input
            label="Name Product"
            placeholder="Name Product"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            label="Price"
            type="number"
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            step="0.01"
          />
          <Input
            label="Categories"
            type="text"
            placeholder="Categories"
            value={categories}
            onChange={(e) => setCategories(e.target.value)}
            required
          />
          <TextArea
            label="Description"
            placeholder="Description"
            className="col-span-1 md:col-span-3"
            textAreaClassName="resize-none text-sm placeholder:text-gray-500"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          {/* TODO: change button to component */}
          <button
            type="submit"
            className="cursor-pointer rounded-md border-0 bg-green-500 px-5 py-1.5 text-white hover:bg-green-500/90 dark:hover:bg-green-900/20"
          >
            Save
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-md border border-gray-300 bg-white px-5 py-1.5 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:bg-transparent dark:text-white dark:hover:bg-gray-800"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
