import { useEffect, useRef } from 'react';

import { useAuth } from '@/hooks/useAuth';
import { cartService } from '@/services/cartService';
import { productService } from '@/services/productService';
import { useCartStore } from '@/store/useCartStore';
import type { CartItem } from '@/types/cart.types';

const lineProductId = (item: CartItem) =>
  String(item.product.id || item.product._id);

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
        const snapshot = useCartStore.getState().items;
        const ids = [...new Set(snapshot.map(lineProductId))];

        const activeIds = new Set(
          (
            await Promise.all(
              ids.map(async (id) => {
                try {
                  const p = await productService.getById(id);
                  return String(p.status).toLowerCase() === 'active'
                    ? id
                    : null;
                } catch {
                  return null;
                }
              }),
            )
          ).filter((id): id is string => id !== null),
        );

        const pruned =
          ids.length === 0
            ? snapshot
            : snapshot.filter((item) => activeIds.has(lineProductId(item)));

        if (pruned.length !== snapshot.length) {
          useCartStore.getState().setCart(pruned);
        }

        await cartService.updateCart(
          pruned.map((item) => ({
            productId: lineProductId(item),
            quantity: item.quantity,
          })),
        );
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
