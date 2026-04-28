import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import { AccountSidebar, BackButton, Button } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import {
  type UserResponse,
  type UserWishlistItem,
  wishlistService,
} from '@/services/wishlist.service';
import type { User } from '@/types/user';

type ExtendedUser = User & UserResponse;

export function Wishlist() {
  const navigate = useNavigate();
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [wishlistItems, setWishlistItems] = useState<UserWishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
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
  }, []);

  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate(ROUTES.LOGIN);
  };

  const handleRemoveItem = async (productId: string) => {
    try {
      await wishlistService.removeFromWishlist(productId);
      setWishlistItems((prev) =>
        prev.filter((item) => item.productId !== productId),
      );
    } catch (error) {
      console.error('Failed to remove item:', error);
    }
  };

  const handleClearAll = () => {
    setWishlistItems([]);
  };

  if (isLoading)
    return <div className="p-20 text-center">Loading your favorites...</div>;
  if (!user)
    return (
      <div className="p-20 text-center">Please login to see your wishlist</div>
    );

  return (
    <section className="bg-background text-text min-h-screen px-8 lg:px-40 lg:pb-20">
      <BackButton />

      <h1 className="text-text mt-10 mb-16 text-center text-[40px] leading-none font-semibold md:text-[54px]">
        Wishlist
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <AccountSidebar user={user} onLogout={handleLogout} />

          <div className="min-w-0 px-2 md:px-6 lg:px-[72px]">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-text text-[20px] font-semibold">
                Your Wishlist
              </h2>

              <Button
                onClick={handleClearAll}
                disabled={wishlistItems.length === 0}
                className="text-text hover:bg-backgroundSec h-[40px] rounded-md border border-neutral-900! bg-transparent px-5 text-sm font-medium transition disabled:cursor-not-allowed"
              >
                Clear all
              </Button>
            </div>

            <div className="text-muted mb-3 hidden grid-cols-[minmax(0,1fr)_120px_120px] border-b border-[#E8ECEF] pb-3 text-sm md:grid">
              <span className="pl-[82px]">Product</span>
              <span>Price</span>
              <span>Action</span>
            </div>

            {wishlistItems.length === 0 ? (
              <div className="text-muted border border-dashed border-[#D9D9D9] py-10 text-center text-sm">
                Your wishlist is empty.
              </div>
            ) : (
              <div>
                {wishlistItems.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-1 gap-4 border-b border-[#E8ECEF] py-4 md:grid-cols-[minmax(0,1fr)_120px_120px] md:items-center md:gap-0"
                  >
                    <div className="flex items-center gap-3">
                      <Button
                        type="button"
                        onClick={() => handleRemoveItem(item.productId)}
                        className="text-muted hover:text-text shrink-0 cursor-pointer border-none bg-transparent transition"
                        aria-label={`Remove ${item.title} from wishlist`}
                      >
                        <X size={18} />
                      </Button>

                      <img
                        src={item.image || '/placeholder.png'}
                        alt={item.title}
                        className="h-[72px] w-[72px] rounded-sm object-cover"
                      />

                      <div>
                        <p className="text-text text-sm font-semibold">
                          {item.title}
                        </p>
                      </div>
                    </div>

                    <p className="text-text text-sm md:text-base">
                      ${item.price}
                    </p>

                    <Button
                      type="button"
                      className="bg-text text-background h-[42px] w-[130px] rounded-md text-sm font-medium transition hover:opacity-90"
                    >
                      Add to cart
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
