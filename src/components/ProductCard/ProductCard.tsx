import { useState } from 'react';
import { Heart, Image as ImageIcon } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types';

import { Button } from '../Button/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { _id, title, price, imageUrl } = product;
  const addItem = useCartStore((state) => state.addItem);
  const [imgError, setImgError] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product);
  };

  return (
    <div className="group relative flex flex-col">
      <a
        href={ROUTES.PRODUCT.replace(':id', _id)}
        className="relative mb-3 block overflow-hidden rounded-md"
        aria-label={title}
      >
        {imageUrl && !imgError ? (
          <img
            src={imageUrl}
            alt={title}
            onError={() => setImgError(true)}
            className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-64 w-full items-center justify-center bg-gray-100 transition-transform duration-300 group-hover:scale-105 dark:bg-gray-800">
            <ImageIcon className="h-16 w-16 text-gray-300 dark:text-gray-600" />
          </div>
        )}
        <div className="absolute right-0 bottom-0 left-0 translate-y-full px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button
            className="w-full rounded-md bg-[#141718] py-3 text-sm font-medium text-white transition-all outline-none hover:border hover:border-white"
            onClick={handleAddToCart}
          >
            Add to Cart
          </Button>
        </div>
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110"
        >
          <Heart className="h-4 w-4" />
        </button>
      </a>
      <div className="flex flex-col">
        <h3 className="line-clamp-2 text-sm font-medium text-[rgb(var(--color-text))]">
          {title}
        </h3>
        <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
          ${price}
        </span>
      </div>
    </div>
  );
};
