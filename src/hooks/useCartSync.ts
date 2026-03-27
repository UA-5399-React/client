import { useEffect, useRef } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/useCartStore';

export const useCartSync = () => {
  const { isAuth } = useAuth();
  const { items } = useCartStore();
  const isInitialMount = useRef(true);
  const debounceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    if (!isAuth) return;

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(async () => {
      try {
        const payload = items.map((item) => ({
          productId: String(item.product.id || item.product._id),
          quantity: item.quantity,
        }));

        await cartService.updateCart(payload);
      } catch (error) {
        console.error('Failed to sync cart to backend:', error);
      }
    }, 1000);

    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current);
      }
    };
  }, [items, isAuth]);
};
