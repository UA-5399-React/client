import { useMutation } from '@apollo/client/react';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import {
  GET_ORDERS,
  UPDATE_ORDER,
} from '@/services/graphql/ordersAdminService';
import type { UpdateOrderPayload } from '@/types/tableOrders.types';

export const useAdminEditOrderFlow = () => {
  const [updateOrderInfo, { loading }] = useMutation(UPDATE_ORDER);

  const updateOrder = async (orderId: string, payload: UpdateOrderPayload) => {
    try {
      await updateOrderInfo({
        variables: {
          input: {
            orderId,
            status: payload.status.toUpperCase(),
            user: {
              firstName: payload.firstName,
              lastName: payload.lastName,
              email: payload.email,
              phone: payload.phone,
            },
            shippingAddress: {
              carrier: payload.shippingAddress.carrier.toUpperCase(),
              city: payload.shippingAddress.city,
              branchNumber: payload.shippingAddress.branchNumber,
            },
            items: payload.items.map((item) =>
              item.remove
                ? {
                    productId: item.productId,
                    amount: item.amount,
                    remove: true,
                  }
                : { productId: item.productId, amount: item.amount },
            ),
          },
        },
        refetchQueries: [
          {
            query: GET_ORDERS,
            variables: ORDERS_QUERY,
          },
        ],
        awaitRefetchQueries: true,
      });
    } catch (error) {
      console.error('Failed to update order:', error);
      throw error;
    }
  };

  return {
    updateOrder,
    isUpdateOrderInfo: loading,
  };
};
