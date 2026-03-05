import type { Product } from '../../types';
import { Button } from '../Button/Button';

interface ProductCardProps {
  product: Product;
}

export const ProductCard = ({ product }: ProductCardProps) => {
  const { title, price, imageUrl } = product;

  return (
    <div className="group relative flex flex-col">
      <div className="relative mb-3 overflow-hidden rounded-md bg-[rgb(var(--color-muted)/0.15)]">
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
          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:opacity-100 hover:scale-110"
        >
          <svg
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
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
