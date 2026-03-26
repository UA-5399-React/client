import { useNavigate } from 'react-router-dom';

import { AdminOrderForm } from '@/components';
import { ROUTES } from '@/constants';
import type { OrderFormData } from '@/types/tableOrders.types';

export function AdminCreateOrder() {
  const navigate = useNavigate();

  const handleCreate = async (formData: OrderFormData) => {
    // Temporary behavior until backend mutation for orders is added.
    console.log('Create order payload:', {
      customerName: formData.customerName,
      email: formData.email,
      phone: formData.phone,
      status: formData.status,
      productName: formData.productName,
      price: Number(formData.price),
      quantity: Number(formData.quantity),
      totalPrice: Number(formData.price) * Number(formData.quantity),
    });

    navigate(ROUTES.ADMIN_ORDERS);
  };

  const handleCancel = () => {
    navigate(ROUTES.ADMIN_ORDERS);
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="mx-auto max-w-4xl p-6">
        <AdminOrderForm onSubmit={handleCreate} onCancel={handleCancel} />
      </div>
    </div>
  );
}
