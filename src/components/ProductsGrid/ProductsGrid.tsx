import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

import { wishlistService } from '@/services/wishlist.service';

import type { Product } from '../../types';
import ProductCard from '../ProductCard';
import type { ViewType } from './types';

interface ProductGridProps {
  products: Product[];
  isLoading?: boolean;
  viewType?: ViewType;
  error?: string | null;
}

export const ProductsGrid: React.FC<ProductGridProps> = ({
  products,
  isLoading = false,
  viewType = 'grid-5',
  error = null,
}: ProductGridProps) => {
  const [wishlistIds, setWishlistIds] = useState<Set<string>>(new Set());
  const location = useLocation();

  const fetchWishlist = async () => {
    try {
      const user = await wishlistService.getMe();

      const ids = new Set(
        user.wishlist?.map((item: { productId: string }) => item.productId) ||
          [],
      );

      setWishlistIds(ids);
    } catch (err) {
      console.error('Failed to fetch wishlist', err);
    }
  };

  useEffect(() => {
    const loadWishlist = async () => {
      await fetchWishlist();
    };

    void loadWishlist();
  }, [location.pathname]);

  const gridClass = {
    'grid-4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
    'grid-5': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-5',
    list: 'grid-cols-2',
  }[viewType];

  if (isLoading && (!products || products.length === 0)) {
    return (
      <div className="w-full">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="animate-pulse rounded-lg border border-neutral-100 bg-neutral-100"
            >
              <div className="mb-4 aspect-square rounded-lg bg-neutral-200" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-3/4 rounded bg-neutral-200" />
                <div className="h-4 w-1/2 rounded bg-neutral-200" />
                <div className="mt-auto h-10 rounded bg-neutral-200" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6">
        <div className="flex items-center gap-3">
          <AlertCircle className="text-red-600" size={24} />
          <div>
            <p className="text-sm font-medium text-red-900">
              Error loading products
            </p>
            <p className="mt-1 text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-6">
        <div className="text-center">
          <p className="text-color-text text-sm font-medium">
            No products found
          </p>
          <p className="mt-1 text-sm text-neutral-500">
            Try adjusting your filters
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`grid gap-4 pb-12 transition-opacity duration-500 sm:gap-5 lg:gap-6 ${isLoading ? 'opacity-50' : 'opacity-100'} ${gridClass}`}
    >
      {products.map((product) => {
        const productId = String(product._id || product.id);
        const isFavorite = wishlistIds.has(productId);
        return viewType === 'list' ? (
          <ProductCard /// List view can have a different card design, so we can create a separate component if needed
            key={productId}
            product={product}
            isFavorite={isFavorite}
            onWishlistChange={fetchWishlist}
          />
        ) : (
          <div key={productId} className="w-full min-w-0 overflow-hidden">
            <ProductCard
              product={product}
              isFavorite={isFavorite}
              onWishlistChange={fetchWishlist}
            />
          </div>
        );
      })}
    </div>
  );
};
