import { useMutation } from '@tanstack/react-query';

import { useCartStore } from '@/store/useCartStore';

import { type CheckoutItem, paymentService } from '../services/paymentService';

export function useCheckout() {
  const items = useCartStore((s) => s.items);

  const mutation = useMutation({
    mutationFn: async () => {
      const checkoutItems: CheckoutItem[] = items.map((item) => ({
        productId: item.product._id ?? item.product.id,
        title: item.product.title,
        price: item.product.price,
        quantity: item.quantity,
        imageUrl: item.product.imageUrl,
      }));

      const { sessionUrl } =
        await paymentService.createCheckoutSession(checkoutItems);

      window.location.href = sessionUrl;
    },
  });

  return {
    checkout: mutation.mutate,
    isLoading: mutation.isPending,
    error: mutation.error,
  };
}
