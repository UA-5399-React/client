import { useQuery } from '@apollo/client/react';

import { GET_USER } from '@/services/graphql/userAdminService';
import type { AdminUserDetails } from '@/types/admin-user.types';

interface GetUserData {
  user: AdminUserDetails;
}

export function useGetAdminUser(id?: string) {
  const { data, loading, error } = useQuery<GetUserData>(GET_USER, {
    variables: { id },
    skip: !id,
    fetchPolicy: 'cache-and-network',
  });

  return {
    user: data?.user,
    loading,
    error,
  };
}
