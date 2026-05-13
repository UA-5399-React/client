import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks';
import { wishlistService } from '@/services/wishlist.service';
import { useErrorStore } from '@/store/errorStore';
import { useWishlistStore } from '@/store/useWishlistStore';

interface HeartButtonProps {
  product: {
    id: string;
    title: string;
    price: number;
    image?: string;
  };
  isFavorite: boolean;
  onChange?: () => void;
}

export const HeartButton = ({
  product,
  isFavorite: initialIsFavorite,
}: HeartButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(initialIsFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { isAuth } = useAuth();

  const showMessage = useErrorStore((s) => s.show);
  const addWishlistItem = useWishlistStore((state) => state.addItem);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);

  useEffect(() => {
    setIsFavorite(initialIsFavorite);
  }, [initialIsFavorite]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLoading) return;

    const previousState = isFavorite;

    setIsFavorite(!previousState);
    setIsLoading(true);

    const wishlistItem = {
      productId: product.id,
      title: product.title,
      price: product.price,
      image: product.image,
    };

    if (previousState) {
      removeWishlistItem(product.id);
    } else {
      addWishlistItem(wishlistItem);
    }

    try {
      if (previousState) {
        await wishlistService.removeFromWishlist(product.id);

        showMessage('success', 'Removed', 'Product removed from wishlist');
      } else {
        await wishlistService.addToWishlist(wishlistItem);

        showMessage('success', 'Added', 'Product added to wishlist');
      }
    } catch (error) {
      if (!isAuth) {
        navigate(ROUTES.LOGIN);
      }

      setIsFavorite(previousState);

      if (previousState) {
        addWishlistItem(wishlistItem);
      } else {
        removeWishlistItem(product.id);
      }

      showMessage(
        'error',
        'Wishlist Error',
        error instanceof Error ? error.message : 'Something went wrong',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={isLoading}
      className="absolute top-3 right-3 z-20 flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-sm transition-all hover:scale-110 active:scale-90 disabled:opacity-70 dark:border-neutral-700 dark:bg-neutral-800"
      aria-label={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}
    >
      <Heart
        size={20}
        strokeWidth={isFavorite ? 2.5 : 1.8}
        className={`transition-all duration-300 ${
          isFavorite
            ? 'fill-red-600 stroke-red-600'
            : 'fill-transparent stroke-gray-400'
        } ${isLoading ? 'animate-pulse' : ''}`}
      />
    </button>
  );
};
