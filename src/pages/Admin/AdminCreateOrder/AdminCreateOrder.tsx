import { useNavigate } from 'react-router-dom';

import { AdminOrderForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminCreateOrderFlow } from '@/hooks';
import { type CreateOrderPayload, PAYMENT_METHODS } from '@/types';
import type { OrderFormData } from '@/types/tableOrders.types';
import { splitCustomerName } from '@/utils';

export function AdminCreateOrder() {
  const navigate = useNavigate();
  const { createOrder, isCreatingOrder } = useAdminCreateOrderFlow();

  const handleCreate = async (formData: OrderFormData) => {
    const { firstName, lastName } = splitCustomerName(formData.customerName);

    const payload: CreateOrderPayload = {
      items: formData.items.map((item) => ({
        product: item.productId,
        amount: Number(item.quantity),
      })),
      user: {
        firstName,
        lastName,
        email: formData.email,
        phone: formData.phone,
      },
      paymentMethod: PAYMENT_METHODS.CASH_ON_DELIVERY,
      shippingAddress: {
        carrier: formData.carrier,
        city: formData.city,
        branchNumber: formData.branchNumber,
      },
    };

    try {
      await createOrder(payload, formData.status);
      navigate(ROUTES.ADMIN_ORDERS);
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_ORDERS);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-4xl p-6">
        <AdminOrderForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={isCreatingOrder}
        />
      </div>
    </div>
  );
}
