import { useMutation } from '@apollo/client/react';

import { CREATE_USER } from '@/services/graphql/userAdminService';
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
    refetchQueries: 'active',
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
