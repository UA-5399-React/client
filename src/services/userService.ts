import { apiClient } from './api';
import type { User, ApiResponse } from '../types';

// TODO: this is just an example service, you can customize it as needed

/**
 * User service - handles all user-related API calls
 */
export const userService = {
  /**
   * Fetch all users
   */
  getUsers: async (): Promise<User[]> => {
    const response = await apiClient.get<ApiResponse<User[]>>('/users');
    return response.data;
  },

  /**
   * Create a new user
   */
  createUser: async (
    userData: Omit<User, 'id' | 'createdAt'>,
  ): Promise<User> => {
    const response = await apiClient.post<ApiResponse<User>>(
      '/users',
      userData,
    );
    return response.data;
  },
};
