import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/useCartStore';

export const CartCounter = () => {
  const { items } = useCartStore();
  const { isDark } = useTheme();

  const cartItemCount = items.reduce((total, item) => total + item.quantity, 0);

  if (cartItemCount <= 0) return null;

  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
        isDark ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      {cartItemCount}
    </span>
  );
};
