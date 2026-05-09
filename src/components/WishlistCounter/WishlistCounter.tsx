import { useTheme } from '@/hooks/useTheme';
import { useWishlistProducts } from '@/hooks/useWishlistProducts';
import { useWishlistStore } from '@/store/useWishlistStore';

export const WishlistCounter = () => {
  useWishlistProducts();

  const { isDark } = useTheme();
  const wishlistItemCount = useWishlistStore((state) => state.items.length);

  if (wishlistItemCount <= 0) return null;

  return (
    <span
      className={`flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold ${
        isDark ? 'bg-white text-black' : 'bg-black text-white'
      }`}
    >
      {wishlistItemCount}
    </span>
  );
};
