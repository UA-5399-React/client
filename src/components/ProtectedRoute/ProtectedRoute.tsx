import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuth, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  // If the user is authenticated but not an admin or super admin,
  // they should be redirected to the shop page.
  // This ensures only authorized users can access routes protected by this component.
  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to={ROUTES.SHOP} replace />;
  }

  return <Outlet />;
};
