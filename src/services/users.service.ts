import type { User } from '@/types/user';

import { apiClient } from './api';

export type UpdateMePayload = {
  firstName?: string;
  lastName?: string;
};

export const usersService = {
  getMe: (): Promise<User> => {
    return apiClient.get<User>('/users/me');
  },

  updateMe: (data: UpdateMePayload): Promise<User> => {
    return apiClient.patch<User>('/users/me', data);
  },

  changePassword: (data: {
    oldPassword: string;
    newPassword: string;
  }): Promise<void> => {
    return apiClient.patch<void>('/users/me/password', data);
  },

  uploadAvatar: (file: File): Promise<User> => {
    const formData = new FormData();
    formData.append('file', file);

    return apiClient.patchFormData<User>('/users/me/avatar', formData);
  },
};
