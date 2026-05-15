import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

import { BackButton, Button, ConfirmModal } from '@/components';
import { ROUTES } from '@/constants';
import { useWishlistProducts } from '@/hooks/useWishlistProducts';
import {
  type UserWishlistItem,
  wishlistService,
} from '@/services/wishlist.service';
import { useErrorStore } from '@/store/errorStore';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types/product.types';

export function Wishlist() {
  const navigate = useNavigate();

  const [isClearing, setIsClearing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showMessage = useErrorStore((s) => s.show);
  const addItem = useCartStore((state) => state.addItem);

  const {
    wishlistItems,
    isLoading,
    user,
    setWishlistItems,
    handleRemoveItemClick,
  } = useWishlistProducts();

  const handleProductClick = (productId: string) => () => {
    navigate(ROUTES.PRODUCT.replace(':id', productId));
  };

  const handleAddToCart = (
    e: React.MouseEvent<HTMLButtonElement>,
    product: UserWishlistItem,
  ) => {
    e.stopPropagation();

    const productData = {
      ...product,
      _id: product.productId,
      id: product.productId,
      imageUrl: product.image,
      status: 'active',
    };
    addItem(productData as Product);
  };

  const handleClearAll = () => {
    setIsModalOpen(true);
  };

  const confirmClearAll = async () => {
    try {
      setIsClearing(true);

      await wishlistService.clearFullWishlist();

      setWishlistItems([]);
      showMessage(
        'success',
        'Wishlist cleared',
        'All items have been removed.',
      );
    } catch (error) {
      console.error('Failed to clear wishlist:', error);
      showMessage(
        'error',
        'Error',
        error instanceof Error ? error.message : 'Could not clear wishlist',
      );
    } finally {
      setIsClearing(false);
      setIsModalOpen(false);
    }
  };

  if (isLoading)
    return <div className="p-20 text-center">Loading your favorites...</div>;
  if (!user)
    return (
      <div className="p-20 text-center">Please login to see your wishlist</div>
    );

  return (
    <section>
      <BackButton />

      <div>
        <div className="md:pl-6">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-text text-[20px] font-semibold">
              Your Wishlist
            </h2>

            <Button
              onClick={handleClearAll}
              disabled={wishlistItems.length === 0 || isClearing}
              className="text-text hover:bg-backgroundSec h-[40px] rounded-md border border-neutral-900! bg-transparent px-5 text-sm font-medium transition disabled:cursor-not-allowed"
            >
              {isClearing ? 'Clearing...' : 'Clear all'}
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
                  className="grid cursor-pointer grid-cols-1 gap-4 border-b border-[#E8ECEF] py-4 md:grid-cols-[minmax(0,1fr)_120px_120px] md:items-center md:gap-0"
                  onClick={handleProductClick(item.productId)}
                >
                  <div className="flex items-center gap-3">
                    <Button
                      type="button"
                      onClick={(e) => handleRemoveItemClick(e, item.productId)}
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
                    onClick={(e) => handleAddToCart(e, item)}
                  >
                    Add to cart
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isModalOpen && (
        <ConfirmModal
          title="Clear all wishlist?"
          description="Are you sure you want to remove all items from your wishlist? This action cannot be undone."
          confirmText={isClearing ? 'Clearing...' : 'Yes, clear all'}
          cancelText="Cancel"
          onConfirm={confirmClearAll}
          onCancel={() => setIsModalOpen(false)}
          isCritical={true}
        />
      )}
    </section>
  );
}
