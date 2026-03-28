import { useMutation } from '@tanstack/react-query';

import { authService, type RegisterPayload } from '@/services/authService';

export const useRegister = () => {
  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
  });
};
