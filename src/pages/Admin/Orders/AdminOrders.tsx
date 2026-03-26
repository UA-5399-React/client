import { TableOrders } from '@/components';
import { useAdminOrders } from '@/hooks/useAdminOrders';

export function AdminOrders() {
  const { orders, loading, error, handleOrderStatusChange } = useAdminOrders();

  return (
    <TableOrders
      items={orders}
      loading={loading}
      error={error}
      onStatusChange={handleOrderStatusChange}
    />
  );
}
