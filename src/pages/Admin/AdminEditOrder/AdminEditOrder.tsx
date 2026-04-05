import { useMemo } from 'react';
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';

import { AdminOrderForm, Button } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminEditOrderFlow } from '@/hooks';
import type { OrderFormData, OrderItem } from '@/types/tableOrders.types';

type EditOrderLocationState = {
  order?: OrderItem;
};

const splitCustomerName = (fullName: string) => {
  const normalized = fullName.trim().replace(/\s+/g, ' ');
  const [firstName = '', ...lastNameParts] = normalized.split(' ');

  return {
    firstName,
    lastName: lastNameParts.join(' ').trim(),
  };
};

const buildRemovedLineItems = (
  initialLines: { productId: string; amount: number }[],
  currentLines: { productId: string; amount: number }[],
): { productId: string; amount: number; remove: true }[] => {
  const pool = [...currentLines];
  const removals: { productId: string; amount: number; remove: true }[] = [];

  for (const line of initialLines) {
    if (!line.productId) continue;
    const idx = pool.findIndex((c) => c.productId === line.productId);
    if (idx >= 0) {
      pool.splice(idx, 1);
    } else {
      removals.push({
        productId: line.productId,
        amount: line.amount,
        remove: true,
      });
    }
  }

  return removals;
};

export function AdminEditOrder() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as { state: EditOrderLocationState | null };
  const navigate = useNavigate();
  const { updateOrder, isUpdateOrderInfo } = useAdminEditOrderFlow();

  const order = state?.order;

  const initialOrderLines = useMemo(() => {
    if (!order?.items?.length) return [];
    return order.items
      .map((item) => ({
        productId: item.product as string,
        amount: item.amount,
      }))
      .filter((line) => line.productId.length > 0);
  }, [order]);

  if (!id) return <Navigate to={ROUTES.ADMIN_ORDERS} replace />;

  if (!order) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="flex items-center justify-between rounded bg-red-100 p-3 text-red-700 dark:bg-red-900/20 dark:text-red-400">
          <span className="text-sm font-medium">
            Order data not found. Open edit from orders list.
          </span>
          <Button
            onClick={() => navigate(ROUTES.ADMIN_ORDERS)}
            variant="outline"
            className="flex h-8 items-center justify-center border-white bg-red-600 px-4 text-xs font-bold tracking-wider text-white uppercase transition-colors hover:bg-red-700"
          >
            Back to Orders
          </Button>
        </div>
      </div>
    );
  }

  const initialData: OrderFormData = {
    customerName: `${order.user.firstName} ${order.user.lastName}`.trim(),
    email: order.user.email || '',
    phone: order.user.phone || '',
    status: order.status,
    items:
      order.items.length > 0
        ? order.items.map((item) => ({
            productId: (item.product as string) || '',
            productName: item.title,
            price: String(item.unitPrice),
            quantity: String(item.amount),
          }))
        : [{ productId: '', productName: '', price: '', quantity: '1' }],
  };

  const handleSubmit = async (formData: OrderFormData) => {
    const { firstName, lastName } = splitCustomerName(formData.customerName);

    const currentLines = formData.items
      .filter((item) => item.productId.trim().length > 0)
      .map((item) => ({
        productId: item.productId,
        amount: Number(item.quantity),
      }));

    const lineUpdates = formData.items.map((item) => ({
      productId: item.productId,
      amount: Number(item.quantity),
    }));

    const removedLines = buildRemovedLineItems(initialOrderLines, currentLines);

    try {
      await updateOrder(id, {
        status: formData.status,
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
        items: [...lineUpdates, ...removedLines],
      });

      navigate(ROUTES.ADMIN_ORDERS);
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  };

  return (
    <div>
      <div className="mx-auto flex h-screen max-w-4xl items-center justify-center p-6">
        <AdminOrderForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.ADMIN_ORDERS)}
          isLoading={isUpdateOrderInfo}
          isEditMode={true}
          updatedAt={order.updatedAt}
        />
      </div>
    </div>
  );
}
