import { useMutation } from '@apollo/client/react';

import { UPDATE_USER } from '@/services/graphql/userAdminService';
import type { UpdateUserInput } from '@/types/admin-user.types';

interface UpdateUserMutationData {
  updateUser: UpdateUserInput & {
    email?: string;
  };
}

export const useUpdateAdminUser = () => {
  const [updateUserMutation, { data, loading, error }] = useMutation<
    UpdateUserMutationData,
    { input: UpdateUserInput }
  >(UPDATE_USER);

  const updateUser = async (input: UpdateUserInput) => {
    const response = await updateUserMutation({
      variables: {
        input,
      },
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    });

    return response.data?.updateUser ?? null;
  };

  const handleUpdate = async (
    id: string,
    data: Partial<Omit<UpdateUserInput, 'id'>>,
  ) => {
    try {
      await updateUser({ id, ...data });
    } catch (e) {
      console.error('Failed to update user:', e);
      throw e;
    }
  };

  return { updateUser, handleUpdate, data, error, isUpdating: loading };
};
