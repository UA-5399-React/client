import { useEffect, useMemo, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  type UserResponse,
  wishlistService,
} from '@/services/wishlist.service';
import { useWishlistStore } from '@/store/useWishlistStore';
import type { User } from '@/types/user';

const EMPTY_WISHLIST_IDS = new Set<string>();

type ExtendedUser = User & UserResponse;

export const useWishlistProducts = () => {
  const { isAuth } = useAuth();

  const wishlistItems = useWishlistStore((state) => state.items);
  const setWishlistItems = useWishlistStore((state) => state.setItems);
  const removeWishlistItem = useWishlistStore((state) => state.removeItem);
  const clearWishlistItems = useWishlistStore((state) => state.clearItems);

  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const wishlistIds = useMemo(() => {
    if (!isAuth) return EMPTY_WISHLIST_IDS;

    return new Set(wishlistItems.map((item) => item.productId));
  }, [isAuth, wishlistItems]);

  useEffect(() => {
    if (!isAuth) {
      setUser(null);
      clearWishlistItems();
      return;
    }

    const loadWishlist = async () => {
      try {
        setIsLoading(true);

        const userData = await wishlistService.getMe();

        setUser(userData as ExtendedUser);
        setWishlistItems(userData.wishlist || []);
      } catch (error) {
        console.error('Failed to load wishlist:', error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadWishlist();
  }, [isAuth, setWishlistItems, clearWishlistItems]);

  const handleRemoveItemClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: string,
  ) => {
    e.stopPropagation();

    const previousItems = wishlistItems;

    removeWishlistItem(productId);

    try {
      await wishlistService.removeFromWishlist(productId);
    } catch (error) {
      setWishlistItems(previousItems);
      console.error('Failed to remove item:', error);
    }
  };

  return {
    wishlistIds,
    isAuth,
    wishlistItems,
    isLoading,
    user,
    setWishlistItems,
    handleRemoveItemClick,
  };
};
