import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { BackButton, OrderDetailsTable } from '@/components';
import { orderService } from '@/services/orderService';
import { usersService } from '@/services/users.service';
import type { OrderDetails as OrderDetailsType } from '@/types/order.types';
import type { User } from '@/types/user';
import { mapApiOrderToOrderDetails } from '@/utils/orderMappers';

const formatPrice = (value: number) => `$${value.toFixed(2)}`;

export function OrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();

  const [user, setUser] = useState<User | null>(null);
  const [order, setOrder] = useState<OrderDetailsType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');
  const [orderError, setOrderError] = useState('');

  useEffect(() => {
    const loadPageData = async () => {
      if (!orderId) {
        setOrderError('Order ID is missing');
        setIsLoading(false);
        return;
      }

      try {
        const [currentUser, apiOrders] = await Promise.all([
          usersService.getMe(),
          orderService.getMyOrders(),
        ]);

        const currentOrder = apiOrders.find((item) => item.orderId === orderId);

        setUser(currentUser);

        if (!currentOrder) {
          setOrderError('Order not found');
          return;
        }

        setOrder(mapApiOrderToOrderDetails(currentOrder));
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Failed to load order details';

        setPageError(message);
      } finally {
        setIsLoading(false);
      }
    };

    void loadPageData();
  }, [orderId]);

  if (isLoading) {
    return <div className="text-text p-10">Loading...</div>;
  }

  if (pageError) {
    return <div className="p-10 text-red-600">{pageError}</div>;
  }

  if (orderError) {
    return <div className="p-10 text-red-600">{orderError}</div>;
  }

  if (!user) {
    return <div className="text-text p-10">User not found</div>;
  }

  if (!order) {
    return <div className="text-text p-10">Order not found</div>;
  }

  const displayOrderNumber = order.orderNumber.replace(/^ORD-/, '');

  return (
    <section className="bg-background min-h-screen px-4 pb-16 md:px-8 lg:px-10">
      <BackButton />

      <div>
        <div className="min-w-0 md:pl-6 lg:pl-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-text mb-8 text-center text-3xl font-semibold">
              Order {displayOrderNumber}
            </h2>

            <div className="text-text mb-6 flex items-center justify-between text-base font-medium">
              <p>Order date: {order.createdAt || '—'}</p>

              {order.completedAt && <p>Order completed: {order.completedAt}</p>}
            </div>

            <OrderDetailsTable items={order.items} />

            <div className="text-text flex justify-end pt-6 text-base font-medium">
              <p>Total sum: {formatPrice(order.totalPrice)}</p>
            </div>

            {order.message && (
              <div className="mt-8 border-t border-gray-200 pt-5">
                <h3 className="text-text mb-2 text-sm font-semibold">
                  Comment
                </h3>
                <p className="text-muted text-sm">{order.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
