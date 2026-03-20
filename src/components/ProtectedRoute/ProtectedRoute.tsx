import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

export const ProtectedRoute: React.FC = () => {
  const { isAuth, isAdmin, isSuperAdmin } = useAuth();

  if (!isAuth || (!isAdmin && !isSuperAdmin)) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Outlet />;
};
