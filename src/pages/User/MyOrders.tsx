import { useEffect, useState } from 'react';

import { OrderCard } from '@/components';
import { orderService } from '@/services/orderService';
import type { Order } from '@/types/order.types';
import { mapApiOrderToOrder } from '@/utils/orderMappers';

export function MyOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  useEffect(() => {
    const loadOrders = async () => {
      setIsLoading(true);
      try {
        const apiOrders = await orderService.getMyOrders();
        const mappedOrders = apiOrders.map(mapApiOrderToOrder);
        setOrders(mappedOrders);
      } catch (err) {
        setOrdersError(
          err instanceof Error ? err.message : 'Failed to load orders',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadOrders();
  }, []);

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (ordersError) {
    return <div className="p-10">{ordersError}</div>;
  }

  return (
    <section>
      <div className="mx-auto max-w-[1180px]">
        <div className="-full min-w-0 px-[72px]">
          <h2 className="text-text mb-6 text-xl font-semibold">
            Orders History
          </h2>

          <div className="mb-3 hidden border-b border-gray-200 pb-3 text-sm text-gray-400 md:grid md:grid-cols-[150px_180px_140px_1fr_140px]">
            <span>Number ID</span>
            <span>Dates</span>
            <span>Status</span>
            <span>Price</span>
            <span />
          </div>

          <div className="flex flex-col">
            {orders.length === 0 ? (
              <div className="py-6 text-sm text-gray-500">
                You have no orders yet.
              </div>
            ) : (
              orders.map((order) => <OrderCard key={order.id} order={order} />)
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
