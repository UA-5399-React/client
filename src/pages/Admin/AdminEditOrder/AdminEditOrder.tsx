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

export function AdminEditOrder() {
  const { id } = useParams<{ id: string }>();
  const { state } = useLocation() as {
    state: EditOrderLocationState | null | undefined;
  };
  const navigate = useNavigate();
  const { updateUserInfo, isUpdatingUserInfo } = useAdminEditOrderFlow();

  if (!id) return <Navigate to={ROUTES.ADMIN_ORDERS} replace />;

  const order = state?.order;

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
            productName: item.title,
            price: String(item.unitPrice),
            quantity: String(item.amount),
          }))
        : [{ productName: '', price: '', quantity: '1' }],
  };

  const handleSubmit = async (formData: OrderFormData) => {
    await updateUserInfo(id, {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
    });

    navigate(ROUTES.ADMIN_ORDERS);
  };

  return (
    <div>
      <div className="mx-auto flex h-screen max-w-4xl items-center justify-center p-6">
        <AdminOrderForm
          initialData={initialData}
          onSubmit={handleSubmit}
          onCancel={() => navigate(ROUTES.ADMIN_ORDERS)}
          isLoading={isUpdatingUserInfo}
          isEditMode={true}
          updatedAt={order.updatedAt}
        />
      </div>
    </div>
  );
}
