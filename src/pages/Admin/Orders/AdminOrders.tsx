import { useNavigate } from 'react-router-dom';

import { Button, TableOrders } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminOrders } from '@/hooks/useAdminOrders';

export function AdminOrders() {
  const navigate = useNavigate();
  const { orders, loading, error } = useAdminOrders();

  return (
    <div>
      <div className="flex items-center justify-end border-b border-[#e5e7eb] px-4 py-3">
        <Button
          variant="primary"
          onClick={() => navigate(ROUTES.ADMIN_ORDER_CREATE)}
        >
          + Add Order
        </Button>
      </div>

      <TableOrders items={orders} loading={loading} error={error} />
    </div>
  );
}
