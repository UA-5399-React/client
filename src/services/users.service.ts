import { API_BASE_URL } from '@/constants';
import type { User } from '@/types/user';

export type UpdateMePayload = {
  firstName?: string;
  lastName?: string;
};

export const usersService = {
  getMe: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'GET',
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to fetch current user');
    }

    return response.json();
  },

  updateMe: async (data: UpdateMePayload): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile');
    }

    return response.json();
  },

  changePassword: async (data: {
    oldPassword: string;
    newPassword: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/users/me/password`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Failed to change password');
    }
  },
};
