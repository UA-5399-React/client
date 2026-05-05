import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Minus, Plus } from 'lucide-react';

import { ImageSlider } from '@/components';
import { ROUTES } from '@/constants';
import { useShopCategories } from '@/hooks/useShopCategories';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';

type ResolvedCategory = {
  id: string;
  title: string;
};

export const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const { data: categories = [] } = useShopCategories();

  const {
    data: product,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productService.getById(id as string),
    enabled: !!id,
  });

  if (isLoading)
    return <div className="p-10 text-center text-xl">Loading product...</div>;
  if (isError || !product)
    return (
      <div className="p-10 text-center text-red-500">
        Error loading product!
      </div>
    );

  const productCategories = product.categories ?? [];

  const resolvedCategories: ResolvedCategory[] = productCategories.reduce(
    (acc: ResolvedCategory[], value: string) => {
      const matchedCategory = categories.find(
        (category) =>
          String(category.id) === String(value) || category.title === value,
      );

      if (!matchedCategory) {
        return acc;
      }

      const categoryId = String(matchedCategory.id);

      if (acc.some((category) => category.id === categoryId)) {
        return acc;
      }

      acc.push({
        id: categoryId,
        title: matchedCategory.title,
      });

      return acc;
    },
    [],
  );

  const handleIncrement = () => setQuantity((prev) => prev + 1);
  const handleDecrement = () => setQuantity((prev) => Math.max(1, prev - 1));

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const images = [
    ...(product.imageUrl ? [product.imageUrl] : []),
    ...(product.additionalImages || []).map((image) => image.imageUrl),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          <ImageSlider images={images} alt={product.title} />
        </div>
        <div className="flex flex-col">
          <h1 className="mb-4 text-4xl font-bold">{product.title}</h1>
          <p className="mb-6 text-gray-600">
            {product.description || 'No info available'}
          </p>
          {resolvedCategories.length > 0 && (
            <div className="mb-6 flex flex-wrap gap-2">
              {resolvedCategories.map((category) => (
                <Link
                  key={category.id}
                  to={`${ROUTES.SHOP}?category=${category.id}`}
                  className="border-fieldBorder bg-backgroundSec text-text hover:bg-background flex items-center rounded-full border px-3 py-1 text-sm transition-colors"
                >
                  {category.title}
                </Link>
              ))}
            </div>
          )}
          <div className="mb-8 text-2xl font-bold">${product.price}</div>
          <div className="border-fieldBorder mb-6 border-t pt-4">
            <div className="flex items-center">
              <span className="text-muted w-24 shrink-0 text-sm font-medium uppercase">
                SKU
              </span>
              <span className="text-text text-sm">
                {product.productCode ?? '—'}
              </span>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-4">
            <div className="flex h-[52px] gap-4">
              <div className="flex w-[120px] items-center justify-between rounded-lg bg-[#F3F5F7] px-2">
                <button
                  onClick={handleDecrement}
                  disabled={quantity <= 1}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-gray-500 transition-colors outline-none hover:bg-gray-200 hover:text-black disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="font-semibold text-black">{quantity}</span>
                <button
                  onClick={handleIncrement}
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md border-none bg-transparent text-gray-500 transition-colors outline-none hover:bg-gray-200 hover:text-black"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <button className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-gray-200 bg-white font-medium text-black transition-all outline-none hover:border-black">
                <Heart className="h-5 w-5" />
                <span>Wishlist</span>
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              className="h-[52px] w-full cursor-pointer rounded-lg border-none bg-[#141718] font-medium text-white transition-all outline-none hover:bg-black"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
