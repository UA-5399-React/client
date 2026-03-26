import { useNavigate } from 'react-router-dom';

import { Button, TableOrders } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminOrders } from '@/hooks/useAdminOrders';

export function AdminOrders() {
  const navigate = useNavigate();
  const { orders, loading, error } = useAdminOrders();
  const handleCreateOrder = () => {
    navigate(ROUTES.ADMIN_ORDER_CREATE);
  };

  return (
    <div>
      <div className="flex items-center justify-start border-b px-4 py-3">
        <Button
          variant="primary"
          onClick={handleCreateOrder}
          className="text-neutral-0 bg-blue-800"
        >
          + Create Order
        </Button>
      </div>

      <TableOrders items={orders} loading={loading} error={error} />
    </div>
  );
}
