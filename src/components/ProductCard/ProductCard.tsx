import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

import type { Product } from '@/types';

import { Button } from '../Button/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  console.log('My product data:', product);
  const { _id, title, price, imageUrl } = product;
  const navigate = useNavigate();
  const handleCardClick = () => {
    navigate(`/product/${_id}`);
  };
  return (
    <div className="group relative flex flex-col">
      <div
        className="relative mb-3 cursor-pointer overflow-hidden rounded-md"
        onClick={handleCardClick}
      >
        <img
          src={imageUrl}
          alt={title}
          className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute right-0 bottom-0 left-0 translate-y-full px-4 pb-4 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Button className="w-full rounded-md bg-[#141718] py-3 text-sm font-medium text-white transition-all outline-none hover:border hover:border-white">
            Add to Cart
          </Button>
        </div>
        <button
          aria-label="Add to wishlist"
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 bg-white text-black opacity-0 transition-all duration-300 group-hover:opacity-100 hover:scale-110"
        >
          <Heart className="h-4 w-4" />
        </button>
      </div>
      <div className="flex flex-col">
        <h3 className="text-sm font-medium text-[rgb(var(--color-text))]">
          {title}
        </h3>
        <span className="text-sm font-semibold text-[rgb(var(--color-text))]">
          ${price}
        </span>
      </div>
    </div>
  );
};
