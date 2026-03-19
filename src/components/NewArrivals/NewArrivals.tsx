import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';

import { ProductCard } from '@/components';
import { ROUTES } from '@/constants';
import type { Product } from '@/types';

import './NewArrivals.css';

interface NewArrivalsProps {
  products: Product[];
  isLoading: boolean;
  isError: boolean;
}

export const NewArrivals = ({
  products,
  isLoading,
  isError,
}: NewArrivalsProps) => {
  const renderState = (text: string) => (
    <div className="mx-auto mb-8 px-16 py-8 text-sm">
      <p className="text-center text-[26px]">{text}</p>
    </div>
  );

  if (isLoading) return renderState('Loading...');
  if (isError) return renderState('Failed to load products.');
  if (!products.length) return renderState('No products yet.');

  return (
    <div className="new-arrivals-root margin-right-16 mx-auto mb-8 px-4 lg:px-16">
      <div className="mb-[48px] flex items-end justify-between">
        <h2 className="m-0 text-[40px] font-medium">
          New <br /> Arrivals
        </h2>

        <span className="border-text border-b-2 font-medium">
          <Link
            to={ROUTES.SHOP}
            className="flex items-center gap-2 text-sm text-gray-500 transition-colors hover:text-gray-700"
          >
            <span className="text-[16px] font-medium">More Products</span>
            <ArrowRightIcon className="h-4 w-4 shrink-0" />
          </Link>
        </span>
      </div>

      <div className="new-arrivals-scroll-out">
        <div className="new-arrivals-scroll-inner flex min-w-0 gap-4 overflow-x-auto scroll-smooth pr-8 pb-4 [scrollbar-width:thin]">
          {products.map((product) => (
            <div
              key={product._id}
              className="new-arrivals-card w-[262px] shrink-0"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
