import type { OrderDetailsItem } from '@/types/order.types';

interface OrderDetailsTableProps {
  items: OrderDetailsItem[];
}

const tableHeadClass = 'border-b border-gray-200 text-sm text-muted';
const tableCellClass = 'py-6 text-sm text-text';
const tableHeadTitleClass = 'pb-4 text-left font-medium';
const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function OrderDetailsTable({ items }: OrderDetailsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className={tableHeadClass}>
            <th className={tableHeadTitleClass}>Product</th>
            <th className={tableHeadTitleClass}>Price</th>
            <th className={tableHeadTitleClass}>Quantity</th>
            <th className={tableHeadTitleClass}>Sum</th>
          </tr>
        </thead>

        <tbody>
          {items.map((item) => (
            <tr
              key={item.productId}
              className="border-b border-gray-200 align-middle"
            >
              <td className="py-6 pr-4">
                <div className="flex min-w-80 items-center gap-4">
                  <div className="bg-backgroundSec flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-muted text-xs">No image</span>
                    )}
                  </div>

                  <p className="text-text text-base font-medium">
                    {item.title}
                  </p>
                </div>
              </td>

              <td className={`${tableCellClass} pr-4`}>
                {formatPrice(item.unitPrice)}
              </td>

              <td className={`${tableCellClass} pr-4`}>{item.amount}</td>

              <td className={tableCellClass}>{formatPrice(item.totalPrice)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
