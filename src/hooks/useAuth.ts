import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';

import { MOCK_AUTH } from '@/constants';
import { authService } from '@/services/authService';
import { useCartStore } from '@/store/useCartStore';
import {
  canAccessAdminPanel,
  isAdminRole,
  isAuthRole,
  isCustomerRole,
  isSuperAdminRole,
} from '@/utils/permissions';

export const useAuth = () => {
  const queryClient = useQueryClient();

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

      useCartStore.getState().clearCart();

      queryClient.removeQueries({ queryKey: ['me'] });
      setIsAuth(false);
    }
  };

  const storedRole = localStorage.getItem(MOCK_AUTH.ROLE_KEY);
  const role = isAuthRole(storedRole) ? storedRole : null;

  const isAdmin = isAdminRole(role);
  const isSuperAdmin = isSuperAdminRole(role);
  const isCustomer = isCustomerRole(role);

  return {
    isAuth,
    role,
    isAdmin,
    isSuperAdmin,
    isCustomer,
    canAccessAdminPanel: canAccessAdminPanel(role),
    logout,
  };
};
