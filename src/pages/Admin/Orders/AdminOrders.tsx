import { useNavigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import { Button, OrdersTopWidgets, OrderTabs, TableOrders } from '@/components';
import { ROUTES } from '@/constants';
import { DEFAULT_ORDER_STATUS_FILTER } from '@/constants/orders';
import { useAdminOrders } from '@/hooks/useAdminOrders';
import { useAdminOrdersCounts } from '@/hooks/useAdminOrdersCounts';
import type { OrderItem } from '@/types/tableOrders.types';

export function AdminOrders() {
  const [searchParams] = useSearchParams();

  const currentStatus =
    searchParams.get('status') || DEFAULT_ORDER_STATUS_FILTER;

  const { orders, loading, error, handleOrderStatusChange } =
    useAdminOrders(currentStatus);
  const { counts, loading: countsLoading } = useAdminOrdersCounts();

  const navigate = useNavigate();

  const handleCreateOrder = () => {
    navigate(ROUTES.ADMIN_ORDER_CREATE);
  };

  const handleEditOrder = (order: OrderItem) => {
    navigate(ROUTES.ADMIN_ORDER_EDIT.replace(':id', order.orderId), {
      state: { order },
    });
  };

  return (
    <div className="flex flex-col p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Orders</h1>
      </div>

      <OrdersTopWidgets counts={counts} loading={countsLoading} />

      <div className="flex items-center justify-start py-3">
        <Button
          variant="primary"
          onClick={handleCreateOrder}
          className="text-neutral-0 bg-blue-800"
        >
          + Create Order
        </Button>
      </div>

      <OrderTabs />

      <TableOrders
        items={orders}
        loading={loading}
        error={error}
        onEdit={handleEditOrder}
        onStatusChange={handleOrderStatusChange}
      />
    </div>
  );
}
