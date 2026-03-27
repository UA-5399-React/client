import { type ReactNode } from 'react';
import clsx from 'clsx';
import { Minus, Plus, TicketPercent, X } from 'lucide-react';

import { Button } from '@/components';
import { type useCartStore } from '@/store/useCartStore';

import { formatCurrency } from './checkout.helpers';

type CartItem = ReturnType<typeof useCartStore.getState>['items'][number];

interface OrderSummaryProps {
  isDark: boolean;
  promoCode: string;
  setPromoCode: (value: string) => void;
  subtotal: number;
  total: number;
  items: CartItem[];
  removeItem: ReturnType<typeof useCartStore.getState>['removeItem'];
  updateQuantity: ReturnType<typeof useCartStore.getState>['updateQuantity'];
}

const SummaryRow = ({
  isDark,
  left,
  right,
}: {
  isDark: boolean;
  left: ReactNode;
  right: ReactNode;
}) => (
  <div
    className={clsx(
      'flex items-center justify-between border-b pb-4',
      isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
    )}
  >
    {left}
    {right}
  </div>
);

const QuantityControl = ({
  isDark,
  title,
  quantity,
  onDecrease,
  onIncrease,
}: {
  isDark: boolean;
  title: string;
  quantity: number;
  onDecrease: () => void;
  onIncrease: () => void;
}) => (
  <div
    className={clsx(
      'mt-3 flex h-8 w-20 items-center rounded-[4px] border px-[7px]',
      isDark ? 'border-gray-700' : 'border-[#6C7275]',
    )}
  >
    <button
      type="button"
      onClick={onDecrease}
      disabled={quantity <= 1}
      className="flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 text-current disabled:opacity-40"
      aria-label={`Decrease quantity for ${title}`}
    >
      <Minus className="h-3 w-3" />
    </button>
    <span
      className={clsx(
        'flex-1 text-center text-xs font-semibold',
        isDark ? 'text-white' : 'text-[#121212]',
      )}
    >
      {quantity}
    </span>
    <button
      type="button"
      onClick={onIncrease}
      className="flex h-4 w-4 items-center justify-center border-none bg-transparent p-0 text-current"
      aria-label={`Increase quantity for ${title}`}
    >
      <Plus className="h-3 w-3" />
    </button>
  </div>
);

const OrderSummaryItem = ({
  item,
  isDark,
  removeItem,
  updateQuantity,
}: {
  item: CartItem;
  isDark: boolean;
  removeItem: ReturnType<typeof useCartStore.getState>['removeItem'];
  updateQuantity: ReturnType<typeof useCartStore.getState>['updateQuantity'];
}) => {
  const productId = item.product.id || item.product._id!;
  const lineTotal = item.product.price * item.quantity;

  return (
    <div
      className={clsx(
        'border-b pb-6',
        isDark ? 'border-gray-700' : 'border-[#E8ECEF]',
      )}
    >
      <div className="flex gap-4">
        {item.product.imageUrl ? (
          <img
            src={item.product.imageUrl}
            alt={item.product.title}
            className="h-24 w-20 object-cover"
          />
        ) : (
          <div
            className={clsx(
              'flex h-24 w-20 items-center justify-center',
              isDark ? 'bg-[#111111]' : 'bg-[#F3F5F7]',
            )}
          >
            <span className="text-xs text-gray-400">No image</span>
          </div>
        )}

        <div className="flex min-w-0 flex-1 justify-between gap-4">
          <div className="min-w-0">
            <p
              className={clsx(
                'text-sm leading-[22px] font-semibold',
                isDark ? 'text-white' : 'text-[#141718]',
              )}
            >
              {item.product.title}
            </p>
            {item.product.categories?.[0] && (
              <p
                className={clsx(
                  'mt-2 text-xs leading-5',
                  isDark ? 'text-gray-400' : 'text-[#6C7275]',
                )}
              >
                {item.product.categories[0]}
              </p>
            )}

            <QuantityControl
              isDark={isDark}
              title={item.product.title}
              quantity={item.quantity}
              onDecrease={() => updateQuantity(productId, item.quantity - 1)}
              onIncrease={() => updateQuantity(productId, item.quantity + 1)}
            />
          </div>

          <div className="flex flex-col items-end">
            <p
              className={clsx(
                'text-sm leading-[22px] font-semibold',
                isDark ? 'text-white' : 'text-[#121212]',
              )}
            >
              {formatCurrency(lineTotal)}
            </p>
            <button
              type="button"
              onClick={() => removeItem(productId)}
              className={clsx(
                'mt-2 border-none bg-transparent p-0',
                isDark ? 'text-gray-400' : 'text-[#141718]',
              )}
              aria-label={`Remove ${item.product.title}`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export function OrderSummary({
  isDark,
  promoCode,
  setPromoCode,
  subtotal,
  total,
  items,
  removeItem,
  updateQuantity,
}: OrderSummaryProps) {
  return (
    <aside
      className={clsx(
        'rounded-[6px] border px-[15px] py-[15px] md:px-[23px] md:py-[31px]',
        isDark ? 'border-gray-700 bg-black' : 'border-[#6C7275] bg-white',
      )}
    >
      <h2
        className={clsx(
          'text-[20px] leading-[28px] font-medium',
          isDark ? 'text-white' : 'text-[#121212]',
        )}
      >
        Order summary
      </h2>

      <div className="mt-6 space-y-6">
        {items.map((item) => (
          <OrderSummaryItem
            key={item.product.id || item.product._id}
            item={item}
            isDark={isDark}
            removeItem={removeItem}
            updateQuantity={updateQuantity}
          />
        ))}

        <div className="flex gap-3">
          <input
            value={promoCode}
            onChange={(event) => setPromoCode(event.target.value)}
            type="text"
            name="promoCode"
            autoComplete="off"
            placeholder="Promo code"
            className={clsx(
              'box-border h-[52px] max-w-full flex-1 rounded-[6px] border px-[15px] text-base outline-none placeholder:text-[#605F5F]',
              isDark
                ? 'border-gray-700 bg-black text-white'
                : 'border-[#CBCBCB] bg-white text-[#141718]',
            )}
          />
          <Button
            type="button"
            onClick={() => setPromoCode('')}
            className={clsx(
              'h-[52px] rounded-[8px] border-none px-6 text-base font-medium shadow-none',
              isDark
                ? 'bg-white text-[#141718] hover:bg-gray-200'
                : 'bg-[#141718] text-white hover:bg-black',
            )}
          >
            Apply
          </Button>
        </div>

        <div className="space-y-4">
          <SummaryRow
            isDark={isDark}
            left={
              <div className="flex items-center gap-2">
                <TicketPercent className="h-4 w-4" />
                <span
                  className={clsx(isDark ? 'text-white' : 'text-[#141718]')}
                >
                  Promo
                </span>
              </div>
            }
            right={<span className="text-[#38CB89]">Not applied</span>}
          />

          <SummaryRow
            isDark={isDark}
            left={
              <span className={clsx(isDark ? 'text-white' : 'text-[#141718]')}>
                Shipping
              </span>
            }
            right={
              <span
                className={clsx(
                  'text-right',
                  isDark ? 'text-gray-400' : 'text-[#6C7275]',
                )}
              >
                Carrier tariffs | Free
              </span>
            }
          />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p
                className={clsx(
                  'text-[20px] leading-[28px] font-medium',
                  isDark ? 'text-white' : 'text-[#141718]',
                )}
              >
                Total <span className="align-top text-sm">*</span>
              </p>
              <p
                className={clsx(
                  'mt-1 text-xs',
                  isDark ? 'text-gray-400' : 'text-[#6C7275]',
                )}
              >
                Final price may change depending on delivery cost.
              </p>
            </div>
            <p
              className={clsx(
                'text-[20px] leading-[28px] font-medium',
                isDark ? 'text-white' : 'text-[#141718]',
              )}
            >
              {formatCurrency(total || subtotal)}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
