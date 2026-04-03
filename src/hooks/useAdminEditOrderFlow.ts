import { useMutation } from '@apollo/client/react';

import { ORDERS_QUERY } from '@/constants/adminOrder';
import {
  GET_ORDERS,
  UPDATE_ORDER_USER_INFO,
} from '@/services/graphql/ordersAdminService';

type UpdateOrderUserPayload = {
  customerName: string;
  email: string;
  phone: string;
};

const splitCustomerName = (fullName: string) => {
  const normalized = fullName.trim().replace(/\s+/g, ' ');
  const [firstName = '', ...lastNameParts] = normalized.split(' ');

  return {
    firstName,
    lastName: lastNameParts.join(' ').trim(),
  };
};

export const useAdminEditOrderFlow = () => {
  const [updateOrderUserInfo, { loading }] = useMutation(
    UPDATE_ORDER_USER_INFO,
  );

  const updateUserInfo = async (
    orderId: string,
    payload: UpdateOrderUserPayload,
  ) => {
    const { firstName, lastName } = splitCustomerName(payload.customerName);

    try {
      await updateOrderUserInfo({
        variables: {
          input: {
            orderId,
            user: {
              firstName,
              lastName,
              email: payload.email,
              phone: payload.phone,
            },
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
      console.error('Failed to update order user info:', error);
      throw error;
    }
  };

  return {
    updateUserInfo,
    isUpdatingUserInfo: loading,
  };
};
