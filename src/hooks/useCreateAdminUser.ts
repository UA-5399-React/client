import { useMutation } from '@apollo/client/react';

import {
  CREATE_USER,
  GET_USERS_LIST,
} from '@/services/graphql/userAdminService';
import type {
  CreateAdminUserInput,
  CreateUserPayload,
} from '@/types/admin-user.types';

interface CreateUserMutationData {
  createUser: CreateUserPayload;
}

export function useCreateAdminUser() {
  const [createUserMutation, { data, loading, error }] = useMutation<
    CreateUserMutationData,
    { input: CreateAdminUserInput }
  >(CREATE_USER, {
    refetchQueries: [{ query: GET_USERS_LIST }],
    awaitRefetchQueries: true,
  });

  const createUser = async (input: CreateAdminUserInput) => {
    const response = await createUserMutation({
      variables: {
        input,
      },
    });

    return response.data?.createUser ?? null;
  };

  return { createUser, data: data?.createUser, loading, error };
}
