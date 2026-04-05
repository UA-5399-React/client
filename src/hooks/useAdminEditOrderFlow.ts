import { useMutation } from '@apollo/client/react';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import {
  GET_ORDERS,
  UPDATE_ORDER,
} from '@/services/graphql/ordersAdminService';
import type { OrderStatus } from '@/types/tableOrders.types';

export type UpdateOrderLinePayload = {
  productId: string;
  amount: number;
  remove?: boolean;
};

type UpdateOrderPayload = {
  status: OrderStatus;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  items: UpdateOrderLinePayload[];
};

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
