import type { CheckoutOrderSnapshot } from '@/types';

const CHECKOUT_ORDER_STORAGE_KEY = 'checkout-order-snapshot';

export const checkoutStorage = {
  save(snapshot: CheckoutOrderSnapshot) {
    localStorage.setItem(CHECKOUT_ORDER_STORAGE_KEY, JSON.stringify(snapshot));
  },

  read(): CheckoutOrderSnapshot | null {
    const rawValue = localStorage.getItem(CHECKOUT_ORDER_STORAGE_KEY);

    if (!rawValue) {
      return null;
    }

    try {
      return JSON.parse(rawValue) as CheckoutOrderSnapshot;
    } catch {
      localStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
      return null;
    }
  },

  clear() {
    localStorage.removeItem(CHECKOUT_ORDER_STORAGE_KEY);
  },
};
