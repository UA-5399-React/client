import { useMutation } from '@apollo/client/react';

import {
  GET_USERS_LIST,
  UPDATE_USER,
} from '@/services/graphql/userAdminService';
import type { UpdateUserInput, User } from '@/types';

interface UpdateUserData {
  updateUser: User;
}

interface UpdateUserVariables {
  updateUserInput: UpdateUserInput & { _id: string };
}

export function useUpdateAdminUser() {
  const [updateUserMutation, { data, loading, error }] = useMutation<
    UpdateUserData,
    UpdateUserVariables
  >(UPDATE_USER, {
    // Після успіху GraphQL сам перевпевить список користувачів
    refetchQueries: [{ query: GET_USERS_LIST }],
    awaitRefetchQueries: true,
  });

  const updateUser = async (id: string, inputData: UpdateUserInput) => {
    return updateUserMutation({
      variables: {
        updateUserInput: {
          _id: id,
          ...inputData,
        },
      },
    });
  };

  return { updateUser, data, loading, error };
}
