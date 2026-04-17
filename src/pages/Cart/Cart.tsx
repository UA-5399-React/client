import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@apollo/client/react';
import clsx from 'clsx';
import { AlertCircle, Minus, Plus, Ticket, X } from 'lucide-react';

import { Button, Input } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { useTheme } from '@/hooks/useTheme';
import { GET_PRODUCTS_PAGE } from '@/services/graphql/productAdminService';
import { useCartStore } from '@/store/useCartStore';
import type { Product } from '@/types/product.types';

interface ProductsPageData {
  productsPage: {
    items: Product[];
    total: number;
    totalPages: number;
    page: number;
    limit: number;
  };
}

export const Cart = () => {
  const { items, updateQuantity, removeItem, getCartTotal, validateCart } =
    useCartStore();
  const { isAuth } = useAuth();
  const { isDark } = useTheme();
  const navigate = useNavigate();

  const [showWarning, setShowWarning] = useState(false);

  const { data } = useQuery<ProductsPageData>(GET_PRODUCTS_PAGE, {
    variables: {
      limit: 100,
      page: 1,
    },
    skip: items.length === 0,
  });

  useEffect(() => {
    if (data?.productsPage?.items && items.length > 0) {
      const wasCleaned = validateCart(data.productsPage.items);

      if (wasCleaned) {
        setTimeout(() => {
          setShowWarning(true);
        }, 0);
      }
    }
  }, [data, validateCart]);

  const [shippingOption, setShippingOption] = useState<
    'free' | 'express' | 'pickup'
  >('free');
  const [couponCode, setCouponCode] = useState('');

  const shippingCost = {
    free: 0,
    express: 15,
    pickup: 0,
  }[shippingOption];

  const subtotal = getCartTotal();
  const total = subtotal + shippingCost;

  const handleCheckout = () => {
    if (!isAuth) {
      navigate(ROUTES.LOGIN, { state: { from: ROUTES.CART } });
    } else {
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode) {
      // @TODO: Add logic for discount
      setCouponCode('');
    }
  };

  if (items.length === 0) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <h1
          className={clsx(
            'text-3xl font-bold',
            isDark ? 'text-white' : 'text-black',
          )}
        >
          Your Cart is Empty
        </h1>
        <p className={clsx(isDark ? 'text-gray-400' : 'text-gray-500')}>
          Looks like you haven't added anything yet.
        </p>
        <Button onClick={() => navigate(ROUTES.SHOP)} className="mt-4 px-8">
          Start Shopping
        </Button>
      </div>
    );
  }

  // @TODO: Implement dynamic data where it needed. Consider an option to replace form with react hook form and validation

  return (
    <div className="relative mx-auto box-border w-full max-w-7xl overflow-hidden px-4 py-8 md:py-12">
      <div className="mb-6 flex items-center md:hidden">
        <Button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 border-none !bg-transparent !p-0 text-sm font-medium shadow-none transition-colors hover:border-transparent hover:opacity-70"
        >
          <span className="text-lg">‹</span> back
        </Button>
      </div>

      <h1
        className={clsx(
          'mb-8 text-center text-4xl font-semibold md:text-5xl',
          isDark ? 'text-white' : 'text-black',
        )}
      >
        Cart
      </h1>

      <div
        className={clsx(
          'scrollbar-hide mb-12 flex items-center gap-8 overflow-x-auto border-b pb-8 md:justify-center',
          isDark ? 'border-gray-800' : 'border-gray-200',
        )}
      >
        <div
          className={clsx(
            'flex shrink-0 items-center gap-4 border-b-2 pb-2',
            isDark ? 'border-white' : 'border-black',
          )}
        >
          <span
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors',
              isDark ? 'bg-white text-black' : 'bg-black text-white',
            )}
          >
            1
          </span>
          <span
            className={clsx(
              'font-semibold',
              isDark ? 'text-white' : 'text-black',
            )}
          >
            Shopping cart
          </span>
        </div>

        <div className="flex shrink-0 items-center gap-4 pb-2 text-gray-400">
          <span
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors',
              isDark
                ? 'bg-gray-800 text-gray-400'
                : 'bg-gray-200 text-gray-500',
            )}
          >
            2
          </span>
          <span className="font-semibold text-gray-400">Checkout details</span>
        </div>

        <div className="flex shrink-0 items-center gap-4 pb-2 text-gray-400">
          <span
            className={clsx(
              'flex h-10 w-10 items-center justify-center rounded-full font-bold transition-colors',
              isDark
                ? 'bg-gray-800 text-gray-400'
                : 'bg-gray-200 text-gray-500',
            )}
          >
            3
          </span>
          <span className="font-semibold text-gray-400">Order complete</span>
        </div>
      </div>

      {showWarning && (
        <div
          className={clsx(
            'animate-in fade-in slide-in-from-top-2 mb-8 flex items-center justify-between rounded-xl border p-4 text-sm transition-all',
            isDark
              ? 'border-neutral-800 bg-neutral-900 text-red-600'
              : 'bg-backgroundSec border-fieldBorder text-red-600',
          )}
        >
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <p className="font-medium text-red-600">
              Some items were no longer available and have been removed from
              your cart.
            </p>
          </div>

          <button
            onClick={() => setShowWarning(false)}
            className={clsx(
              'rounded-full border-none bg-transparent p-2 shadow-none transition-colors outline-none',
              isDark ? 'hover:bg-neutral-800' : 'hover:bg-gray-200',
            )}
          >
            <X className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}
      <div className="grid gap-8 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <div
            className={clsx('p-0 md:p-6', isDark ? 'bg-[#141718]' : 'bg-white')}
          >
            <h2 className="mb-4 text-lg font-semibold md:hidden">Product</h2>
            <div
              className={clsx(
                'hidden border-b pb-4 text-sm font-semibold md:grid md:grid-cols-12',
                isDark ? 'border-gray-800' : 'border-gray-200',
              )}
            >
              <div className="md:col-span-5">Product</div>
              <div className="text-center md:col-span-3">Quantity</div>
              <div className="text-center md:col-span-2">Price</div>
              <div className="text-right md:col-span-2">Subtotal</div>
            </div>

            <div
              className={clsx(
                'divide-y border-b',
                isDark ? 'divide-gray-800 border-gray-800' : 'border-gray-200',
              )}
            >
              {items.map((item) => (
                <div
                  key={item.product.id || item.product._id}
                  className="relative flex flex-col border-b py-6 last:border-b-0 md:grid md:grid-cols-12 md:items-center"
                >
                  <div className="flex gap-4 md:col-span-5">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.title}
                        className="h-20 w-20 rounded-none border border-gray-100 object-cover sm:h-24 sm:w-24 dark:border-gray-800"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center bg-gray-100 sm:h-24 sm:w-24 dark:bg-gray-800">
                        <span className="text-xs text-gray-400">No image</span>
                      </div>
                    )}
                    <div className="flex flex-1 flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3
                            className={clsx(
                              'cursor-pointer text-sm font-semibold hover:underline',
                              isDark ? 'text-white' : 'text-black',
                            )}
                            onClick={() =>
                              navigate(
                                ROUTES.PRODUCT.replace(
                                  ':id',
                                  item.product._id || item.product.id,
                                ),
                              )
                            }
                          >
                            {item.product.title}
                          </h3>
                          <p className="mt-1 text-xs text-gray-400">
                            Color: Black
                          </p>
                          <Button
                            onClick={() =>
                              removeItem(item.product.id || item.product._id!)
                            }
                            className="mt-2 hidden items-center gap-1 border-none !bg-transparent !p-0 text-gray-400 shadow-none transition-colors hover:border-transparent hover:bg-transparent hover:text-black hover:shadow-none md:flex"
                          >
                            <X className="h-5 w-5" />
                            <span>Remove</span>
                          </Button>
                        </div>
                        <div className="flex flex-col items-end gap-2 md:hidden">
                          <span
                            className={clsx(
                              'text-sm font-semibold',
                              isDark ? 'text-white' : 'text-black',
                            )}
                          >
                            ${item.product.price.toFixed(2)}
                          </span>
                          <Button
                            onClick={() =>
                              removeItem(item.product.id || item.product._id!)
                            }
                            className="border-none !bg-transparent !p-0 text-gray-400 shadow-none transition-colors hover:border-transparent hover:bg-transparent hover:text-black hover:shadow-none md:hidden"
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center md:hidden">
                        <div
                          className={clsx(
                            'flex h-8 w-fit items-center rounded-md border',
                            isDark ? 'border-gray-700' : 'border-gray-300',
                          )}
                        >
                          <Button
                            onClick={() =>
                              updateQuantity(
                                item.product.id || item.product._id!,
                                item.quantity - 1,
                              )
                            }
                            disabled={item.quantity <= 1}
                            className="border-none !bg-transparent !p-2 text-gray-500 shadow-none hover:border-transparent hover:bg-transparent hover:text-black hover:shadow-none disabled:opacity-30"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="min-w-[24px] text-center text-xs font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            onClick={() =>
                              updateQuantity(
                                item.product.id || item.product._id!,
                                item.quantity + 1,
                              )
                            }
                            className="border-none !bg-transparent !p-2 text-gray-500 shadow-none hover:border-transparent hover:bg-transparent hover:text-black hover:shadow-none"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Desktop columns */}
                  <div className="hidden items-center md:col-span-3 md:flex md:justify-center">
                    <div
                      className={clsx(
                        'flex w-fit items-center rounded-md border',
                        isDark ? 'border-gray-700' : 'border-gray-300',
                      )}
                    >
                      <Button
                        onClick={() =>
                          updateQuantity(
                            item.product.id || item.product._id!,
                            item.quantity - 1,
                          )
                        }
                        disabled={item.quantity <= 1}
                        className={clsx(
                          'border-none bg-transparent !p-2 transition-colors hover:border-transparent disabled:opacity-50',
                          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                        )}
                      >
                        <Minus
                          className={clsx(
                            'h-4 w-4',
                            isDark ? 'text-white' : 'text-black',
                          )}
                        />
                      </Button>
                      <span
                        className={clsx(
                          'w-10 text-center text-sm font-medium',
                          isDark ? 'text-white' : 'text-black',
                        )}
                      >
                        {item.quantity}
                      </span>
                      <Button
                        onClick={() =>
                          updateQuantity(
                            item.product.id || item.product._id!,
                            item.quantity + 1,
                          )
                        }
                        className={clsx(
                          'border-none bg-transparent !p-2 transition-colors hover:border-transparent',
                          isDark ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
                        )}
                      >
                        <Plus
                          className={clsx(
                            'h-4 w-4',
                            isDark ? 'text-white' : 'text-black',
                          )}
                        />
                      </Button>
                    </div>
                  </div>

                  <div
                    className={clsx(
                      'hidden text-center font-medium md:col-span-2 md:block',
                      isDark ? 'text-gray-300' : 'text-gray-500',
                    )}
                  >
                    ${item.product.price.toFixed(2)}
                  </div>

                  <div
                    className={clsx(
                      'hidden text-right text-lg font-bold md:col-span-2 md:block',
                      isDark ? 'text-white' : 'text-black',
                    )}
                  >
                    ${(item.product.price * item.quantity).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 flex flex-col gap-4 px-4 md:px-6">
              <h3 className="text-lg font-semibold">Have a coupon?</h3>
              <p className="text-sm text-gray-500">
                Add your code for an instant cart discount
              </p>
              <form onSubmit={handleApplyCoupon} className="md:max-w-[450px]">
                <Input
                  placeholder="Coupon Code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  leftIcon={<Ticket className="ml-4 h-5 w-5 text-gray-400" />}
                  rightElement={
                    <Button
                      type="submit"
                      className="mr-4 border-none !bg-transparent !p-0 text-sm font-semibold shadow-none hover:border-transparent hover:bg-transparent hover:opacity-70 hover:shadow-none"
                    >
                      Apply
                    </Button>
                  }
                  className={clsx(
                    isDark ? 'border-gray-700' : 'border-gray-300',
                  )}
                  inputClassName={clsx(
                    '!text-sm',
                    isDark ? '!text-white' : '!text-black',
                  )}
                />
              </form>
            </div>
          </div>
        </div>

        <div className="lg:col-span-4">
          <div
            className={clsx(
              'sticky top-24 rounded-none border p-6 md:rounded-lg',
              isDark ? 'border-gray-800' : 'border-gray-300',
            )}
          >
            <h2
              className={clsx(
                'mb-6 text-xl font-semibold',
                isDark ? 'text-white' : 'text-black',
              )}
            >
              Cart summary
            </h2>

            <div className="mb-6 space-y-3">
              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all',
                  shippingOption === 'free'
                    ? isDark
                      ? 'border-white bg-[#232627]'
                      : 'border-black bg-gray-50'
                    : isDark
                      ? 'border-gray-700'
                      : 'border-gray-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="free"
                    checked={shippingOption === 'free'}
                    onChange={() => setShippingOption('free')}
                    className={clsx(
                      'h-4 w-4',
                      isDark ? 'accent-white' : 'accent-black',
                    )}
                  />
                  <span className="text-sm font-medium">Free shipping</span>
                </div>
                <span className="text-sm">$0.00</span>
              </label>

              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all',
                  shippingOption === 'express'
                    ? isDark
                      ? 'border-white bg-[#232627]'
                      : 'border-black bg-gray-50'
                    : isDark
                      ? 'border-gray-700'
                      : 'border-gray-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="express"
                    checked={shippingOption === 'express'}
                    onChange={() => setShippingOption('express')}
                    className={clsx(
                      'h-4 w-4',
                      isDark ? 'accent-white' : 'accent-black',
                    )}
                  />
                  <span className="text-sm font-medium">Express shipping</span>
                </div>
                <span className="text-sm">+$15.00</span>
              </label>

              <label
                className={clsx(
                  'flex cursor-pointer items-center justify-between rounded-md border p-4 transition-all',
                  shippingOption === 'pickup'
                    ? isDark
                      ? 'border-white bg-[#232627]'
                      : 'border-black bg-gray-50'
                    : isDark
                      ? 'border-gray-700'
                      : 'border-gray-200',
                )}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="shipping"
                    value="pickup"
                    checked={shippingOption === 'pickup'}
                    onChange={() => setShippingOption('pickup')}
                    className={clsx(
                      'h-4 w-4',
                      isDark ? 'accent-white' : 'accent-black',
                    )}
                  />
                  <span className="text-sm font-medium">Pick Up</span>
                </div>
                <span className="text-sm">$0.00</span>
              </label>
            </div>

            <div className={clsx('space-y-4 pt-4')}>
              <div
                className={clsx(
                  'flex justify-between border-b pb-4',
                  isDark
                    ? 'border-gray-800 text-gray-300'
                    : 'border-gray-200 text-black',
                )}
              >
                <span className="text-sm">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
              </div>
              <div
                className={clsx(
                  'flex items-center justify-between py-2 text-lg font-semibold',
                  isDark ? 'text-white' : 'text-black',
                )}
              >
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Button
              className={clsx(
                'mt-4 w-full rounded-md py-4 text-center text-lg font-semibold shadow-lg transition-all active:scale-[0.98]',
                isDark
                  ? 'bg-white text-black hover:bg-gray-200'
                  : 'bg-black text-white hover:bg-gray-800',
              )}
              onClick={handleCheckout}
            >
              Checkout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
