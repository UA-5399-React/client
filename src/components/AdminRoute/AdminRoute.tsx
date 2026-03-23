import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

export const AdminRoute: React.FC = () => {
  const { isAuth, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuth) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  if (!isAdmin && !isSuperAdmin) {
    return <Navigate to={ROUTES.SHOP} replace />;
  }

  return <Outlet />;
};
