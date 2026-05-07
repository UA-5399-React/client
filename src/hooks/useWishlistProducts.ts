import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import {
  type UserResponse,
  type UserWishlistItem,
  wishlistService,
} from '@/services/wishlist.service';
import type { User } from '@/types/user';

const EMPTY_WISHLIST_IDS = new Set<string>();
type ExtendedUser = User & UserResponse;

export const useWishlistProducts = () => {
  const { isAuth } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set());
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [wishlistItems, setWishlistItems] = useState<UserWishlistItem[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuth) return;

    const fetchWishlist = async () => {
      try {
        const user = await wishlistService.getMe();

        setIds(new Set(user.wishlist?.map((item) => item.productId) ?? []));
      } catch (err) {
        console.error('Failed to fetch wishlist', err);
      }
    };

    void fetchWishlist();
  }, [isAuth]);

  useEffect(() => {
    if (!isAuth) {
      setUser(null);
      setWishlistItems([]);
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
  }, [isAuth]);

  const handleRemoveItemClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    productId: string,
  ) => {
    e.stopPropagation();

    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  return {
    wishlistIds: isAuth ? ids : EMPTY_WISHLIST_IDS,
    isAuth: isAuth,
    wishlistItems: wishlistItems,
    isLoading,
    user,
    setWishlistItems,
    handleRemoveItemClick,
  };
};
