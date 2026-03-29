import { useSearchParams } from 'react-router-dom';

import { OrdersTopWidgets, OrderTabs, TableOrders } from '@/components';
import { DEFAULT_ORDER_STATUS_FILTER } from '@/constants/orders';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useAdminOrdersCounts } from '@/hooks/useAdminOrdersCounts';

export function AdminOrders() {
  const [searchParams] = useSearchParams();

  const currentStatus =
    searchParams.get('status') || DEFAULT_ORDER_STATUS_FILTER;

  const { orders, loading, error, handleOrderStatusChange } =
    useAdminOrders(currentStatus);
  const { counts, loading: countsLoading } = useAdminOrdersCounts();
  return (
    <div className="flex flex-col p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Orders</h1>
      </div>
      <OrdersTopWidgets counts={counts} loading={countsLoading} />

      <OrderTabs />

      <TableOrders
        items={orders}
        loading={loading}
        error={error}
        onStatusChange={handleOrderStatusChange}
      />
    </div>
  );
}
