import { useNavigate } from 'react-router-dom';

import type { Product } from '@/types';

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
