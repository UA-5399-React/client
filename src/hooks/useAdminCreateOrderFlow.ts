import { useMutation } from '@apollo/client/react';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import {
  CREATE_ORDER,
  GET_ORDERS,
} from '@/services/graphql/ordersAdminService';
import type { CreateOrderPayload } from '@/types';
import { ORDER_STATUS, type OrderStatus } from '@/types/tableOrders.types';

type CreateOrderResponse = {
  createOrder: {
    orderId: string;
  };
};

export const useAdminCreateOrderFlow = () => {
  const [createOrderInfo, { loading: isCreating }] =
    useMutation<CreateOrderResponse>(CREATE_ORDER);

  const createOrder = async (
    payload: CreateOrderPayload,
    status: OrderStatus = ORDER_STATUS.NEW,
  ) => {
    const input = {
      ...payload,
      status: status.toUpperCase(),
      paymentMethod: payload.paymentMethod.toUpperCase(),
      shippingAddress: {
        ...payload.shippingAddress,
        carrier: payload.shippingAddress.carrier.toUpperCase(),
      },
    };

    const response = await createOrderInfo({
      variables: {
        input,
      },
      refetchQueries: [
        {
          query: GET_ORDERS,
          variables: ORDERS_QUERY,
        },
      ],
      awaitRefetchQueries: true,
    });

    return response;
  };

  return {
    createOrder,
    isCreatingOrder: isCreating,
  };
};
