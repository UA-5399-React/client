import { useMutation } from '@apollo/client/react';

import {
  GET_USERS_LIST,
  UPDATE_USER,
} from '@/services/graphql/userAdminService';
import type { UpdateUserInput } from '@/types/admin-user.types';

export const useUpdateAdminUser = () => {
  const [updateUser, { loading }] = useMutation(UPDATE_USER);

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<UpdateUserInput, 'id'>>,
  ) => {
    try {
      await updateUser({
        variables: {
          input: { id, ...data },
        },
        refetchQueries: [{ query: GET_USERS_LIST }],
        awaitRefetchQueries: true,
      });
    } catch (e) {
      console.error('Failed to update user:', e);
    }
  };

  return { handleUpdate, isUpdating: loading };
};
