import { useState } from 'react';

import { AUTH_ROLES, MOCK_AUTH } from '@/constants';
import { authService } from '@/services/authService';

export const useAuth = () => {
  const [isAuth, setIsAuth] = useState(() => {
    const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
    const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);

    if (!token || !expires) return false;

    return Date.now() < Number(expires);
  });

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error('Error during server logout:', error);
    } finally {
      localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
      localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
      localStorage.removeItem(MOCK_AUTH.ROLE_KEY);

      setIsAuth(false);
    }
  };

  const role = localStorage.getItem(MOCK_AUTH.ROLE_KEY);

  const isAdmin = role === AUTH_ROLES.ADMIN;
  const isSuperAdmin = role === AUTH_ROLES.SUPER_ADMIN;

  return { isAuth, role, isAdmin, isSuperAdmin, logout };
};
