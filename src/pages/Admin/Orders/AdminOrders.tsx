import { useNavigate } from 'react-router-dom';

import { Button, TableOrders } from '@/components';
import { ROUTES } from '@/constants';

export function AdminOrders() {
  const navigate = useNavigate();

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

      <TableOrders />
    </div>
  );
}
