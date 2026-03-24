import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { AUTH_ROLES, type AuthRole, ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: AuthRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = [AUTH_ROLES.ADMIN, AUTH_ROLES.SUPER_ADMIN],
  redirectTo = ROUTES.SHOP,
}) => {
  const { isAuth, role } = useAuth();

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
