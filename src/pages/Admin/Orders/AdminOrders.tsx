import { TableOrders } from '@/components';
import { useAdminOrders } from '@/hooks/useAdminOrders';

export function AdminOrders() {
  const { orders, loading, error } = useAdminOrders();

  return <TableOrders items={orders} loading={loading} error={error} />;
}
