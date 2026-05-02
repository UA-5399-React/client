import { useEffect, useState } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { wishlistService } from '@/services/wishlist.service';

const EMPTY_WISHLIST_IDS = new Set<string>();

export const useWishlistProductIds = () => {
  const { isAuth } = useAuth();
  const [ids, setIds] = useState<Set<string>>(() => new Set());

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

  return {
    wishlistIds: isAuth ? ids : EMPTY_WISHLIST_IDS,
    isAuth: isAuth,
  };
};
