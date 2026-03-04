import React, { useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';

import { ROUTES } from '../../constants';

export const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('token');
  const expires = localStorage.getItem('token_expires');

  const [isAuth] = useState(() => {
    if (!token || !expires) return false;
    return Date.now() < Number(expires);
  });

  if (!isAuth) {
    localStorage.clear();
    return <Navigate to={ROUTES.ADMIN_LOGIN} replace />;
  }

  return <Outlet />;
};
