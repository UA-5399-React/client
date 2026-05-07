import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { Minus, Plus, X } from 'lucide-react';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { useErrorStore } from '@/store/errorStore';
import { useCartStore } from '@/store/useCartStore';

export const FlyoutCart = () => {
  const {
    items,
    isOpen,
    closeCart,
    updateQuantity,
    removeItem,
    clearCart,
    getCartTotal,
  } = useCartStore();
  const { isAuth } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();
  const showMessage = useErrorStore((s) => s.show);

  const total = getCartTotal();

  if (!isOpen) return null;

  const handleCheckout = () => {
    closeCart();
    if (!isAuth) {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.CART } });
    } else {
      navigate('/checkout');
    }
  };

  const handleProductClick = (productId: string) => () => {
    closeCart();
    navigate(ROUTES.PRODUCT.replace(':id', productId));
  };

  const handleQuantityChange = (
    e: React.MouseEvent,
    productId: string,
    quantity: number,
  ) => {
    e.stopPropagation();
    updateQuantity(productId, quantity);
  };

  const handleViewCart = () => {
    closeCart();
    navigate(ROUTES.CART);
  };

  const handleClearAll = () => {
    clearCart();
    showMessage('success', 'Success!', 'Cart cleared');
  };

  // @TODO: Check and implement dynamic data for the places it needed.

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40 transition-opacity"
        onClick={closeCart}
      />

      <div
        className={clsx(
          'fixed top-0 right-0 bottom-0 z-50 flex w-full max-w-md flex-col shadow-xl sm:w-[400px]',
          'animate-in slide-in-from-right duration-300',
          isDark ? 'bg-[#141718] text-white' : 'bg-white text-black',
        )}
      >
        <div
          className={clsx(
            'flex items-center justify-between border-b px-6 py-4',
            isDark ? 'border-gray-800' : 'border-gray-200',
          )}
        >
          <h2
            className={clsx(
              'text-xl font-bold',
              isDark ? 'text-white' : 'text-black',
            )}
          >
            Cart
          </h2>
          <div className="flex items-center gap-2">
            {items.length > 0 && (
              <Button
                onClick={handleClearAll}
                className={clsx(
                  'h-fit w-fit rounded border px-3 py-1 text-sm transition-colors hover:border-transparent',
                  isDark
                    ? 'border-gray-600 bg-transparent text-gray-300 hover:bg-gray-700 hover:text-white'
                    : 'border-gray-300 bg-transparent text-gray-600 hover:bg-gray-100 hover:text-black',
                )}
              >
                Clear all
              </Button>
            )}
            <Button
              onClick={closeCart}
              aria-label="Close cart"
              className={clsx(
                'h-fit w-fit border-none bg-transparent !p-0 transition-colors hover:border-transparent',
                isDark
                  ? 'text-gray-400 hover:text-white'
                  : 'text-gray-500 hover:text-black',
              )}
            >
              <X className="h-6 w-6" />
            </Button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div
              className={clsx(
                'flex h-full items-center justify-center text-center',
                isDark ? 'text-gray-400' : 'text-gray-500',
              )}
            >
              Your cart is empty.
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={item.product.id || item.product._id}
                  onClick={handleProductClick(
                    item.product.id || item.product._id!,
                  )}
                  className={clsx(
                    'flex cursor-pointer gap-4 border-b pb-6',
                    isDark ? 'border-gray-800' : 'border-gray-200',
                  )}
                >
                  {item.product.imageUrl ? (
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      className={clsx(
                        'h-24 w-24 rounded-md border object-cover',
                        isDark ? 'border-gray-800' : 'border-gray-100',
                      )}
                    />
                  ) : (
                    <div
                      className={clsx(
                        'flex h-24 w-24 items-center justify-center rounded-md',
                        isDark ? 'bg-gray-800' : 'bg-gray-100',
                      )}
                    >
                      <span className="text-xs text-gray-400">No img</span>
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between">
                      <h3 className="mt-0.5 mb-0 line-clamp-2 text-sm font-semibold">
                        {item.product.title}
                      </h3>
                      <div className="flex flex-col items-end gap-1">
                        <span className="pl-2 font-semibold">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="mt-2 flex items-center justify-between">
                      <div
                        className={clsx(
                          'flex h-9 w-fit items-center rounded-md border',
                          isDark ? 'border-gray-700' : 'border-gray-300',
                        )}
                      >
                        <Button
                          onClick={(e) =>
                            handleQuantityChange(
                              e,
                              item.product.id || item.product._id!,
                              item.quantity - 1,
                            )
                          }
                          aria-label={`Decrease quantity for ${item.product.title}`}
                          disabled={item.quantity <= 1}
                          className={clsx(
                            'flex h-full w-8 items-center justify-center border-none bg-transparent !p-0 transition-colors hover:border-transparent disabled:opacity-50',
                            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                          )}
                        >
                          <Minus
                            className={clsx(
                              'h-3 w-3',
                              isDark ? 'text-white' : 'text-black',
                            )}
                          />
                        </Button>
                        <span
                          className={clsx(
                            'flex h-full w-8 items-center justify-center text-center text-xs font-medium',
                            isDark ? 'text-white' : 'text-black',
                          )}
                        >
                          {item.quantity}
                        </span>
                        <Button
                          onClick={(e) =>
                            handleQuantityChange(
                              e,
                              item.product.id || item.product._id!,
                              item.quantity + 1,
                            )
                          }
                          aria-label={`Increase quantity for ${item.product.title}`}
                          className={clsx(
                            'flex h-full w-8 items-center justify-center border-none bg-transparent !p-0 transition-colors hover:border-transparent',
                            isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                          )}
                        >
                          <Plus
                            className={clsx(
                              'h-3 w-3',
                              isDark ? 'text-white' : 'text-black',
                            )}
                          />
                        </Button>
                      </div>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeItem(item.product.id || item.product._id!);
                        }}
                        aria-label={`Remove ${item.product.title}`}
                        className={clsx(
                          'h-fit w-fit border-none bg-transparent !p-0 transition-colors hover:border-transparent',
                          isDark
                            ? 'text-gray-400 hover:text-white'
                            : 'text-gray-500 hover:text-black',
                        )}
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div
            className={clsx(
              'mt-auto border-t px-6 py-6',
              isDark
                ? 'border-gray-800 bg-[#141718]'
                : 'border-gray-200 bg-gray-50',
            )}
          >
            <div className="mb-2 flex justify-between text-sm">
              <span className={isDark ? 'text-gray-400' : 'text-gray-500'}>
                Subtotal
              </span>
              <span
                className={clsx(
                  'font-semibold',
                  isDark ? 'text-white' : 'text-black',
                )}
              >
                ${total.toFixed(2)}
              </span>
            </div>
            <div className="mb-6 flex justify-between text-xl font-bold">
              <span className={isDark ? 'text-white' : 'text-black'}>
                Total
              </span>
              <span className={isDark ? 'text-white' : 'text-black'}>
                ${total.toFixed(2)}
              </span>
            </div>

            <Button
              className={clsx(
                'w-full rounded-md py-4 text-center text-lg font-bold shadow-lg transition-all hover:-translate-y-0.5',
                isDark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800',
              )}
              onClick={handleCheckout}
            >
              Checkout
            </Button>

            <Button
              onClick={handleViewCart}
              className={clsx(
                'mx-auto mt-6 block w-fit !bg-transparent !p-0 text-center text-base font-bold underline decoration-2 underline-offset-4 shadow-none transition-all hover:opacity-75 hover:shadow-none',
                isDark ? 'text-white' : 'text-black',
              )}
            >
              View Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
};
