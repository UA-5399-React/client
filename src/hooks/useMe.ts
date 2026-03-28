import { useQuery } from '@tanstack/react-query';

import { usersService } from '@/services/users.service';

export const useMe = (enabled: boolean) => {
  return useQuery({
    queryKey: ['me'],
    queryFn: usersService.getMe,
    enabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
