import { useMutation } from '@tanstack/react-query';

import { authService, type LoginPayload } from '@/services/authService';

export const useLogin = () => {
  return useMutation({
    mutationFn: (credentials: LoginPayload) => authService.login(credentials),
  });
};
