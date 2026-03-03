import { useMutation, useQuery } from '@tanstack/react-query';

import { userService } from '../services';
import type { User } from '../types';

// TODO: these hooks are just examples, you can customize them as needed
/**
 * Hook to fetch all users
 */
export const useGetUsers = () => {
  return useQuery({
    queryKey: ['users-list'],
    queryFn: userService.getUsers,
  });
};

/**
 * Hook to create a new user
 */
export const useCreateUser = () => {
  return useMutation({
    mutationFn: (userData: Omit<User, 'id' | 'createdAt'>) =>
      userService.createUser(userData),
    onSuccess: () => {},
  });
};
