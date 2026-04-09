import { useMutation } from '@apollo/client/react';

import { DELETE_USER } from '@/services/graphql/userAdminService';

export function useDeleteAdminUser() {
  const [deleteUserMutation, { data, loading, error }] = useMutation(
    DELETE_USER,
    {
      refetchQueries: 'active',
      awaitRefetchQueries: true,
    },
  );

  const deleteUser = async (id: string) => {
    return deleteUserMutation({
      variables: { id },
    });
  };

  return { deleteUser, data, loading, error };
}
