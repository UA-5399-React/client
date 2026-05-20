import { useNavigate } from 'react-router-dom';

import { AdminOrderForm } from '@/components';
import { ROUTES } from '@/constants';
import { useAdminCreateOrderFlow } from '@/hooks';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { useErrorStore } from '@/store/errorStore';
import { type CreateOrderPayload, PAYMENT_METHODS } from '@/types';
import type { OrderFormData } from '@/types/tableOrders.types';
import { splitCustomerName } from '@/utils';

export function AdminCreateOrder() {
  const navigate = useNavigate();
  const { createOrder, isCreatingOrder } = useAdminCreateOrderFlow();

  useErrorMessage();
  const showMessage = useErrorStore((s) => s.show);

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
      navigate(ROUTES.ADMIN_ORDERS, {
        state: {
          successMessage: 'Order created successfully',
        },
      });
    } catch (error) {
      showMessage(
        'error',
        'category action failed',
        error instanceof Error ? error.message : 'Something went wrong',
      );
      console.error('Failed to create order:', error);
      throw error;
    }
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_ORDERS, {
      state: {
        errorMessage: 'Order creation cancelled',
      },
    });
  };

  return (
    <div className="grid place-items-center px-4 py-6">
      <div className="max-h-[calc(100dvh-3rem)] min-h-0 w-full max-w-4xl overflow-y-auto overscroll-y-contain">
        <AdminOrderForm
          onSubmit={handleCreate}
          onCancel={handleCancel}
          isLoading={isCreatingOrder}
        />
      </div>
    </div>
  );
}
