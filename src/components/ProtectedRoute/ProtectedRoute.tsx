import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { type AuthRole, ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: AuthRole[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles,
  redirectTo = ROUTES.SHOP,
}) => {
  const { isAuth, role } = useAuth();
  const location = useLocation();

  if (!isAuth) {
    return (
      <Navigate
        to={ROUTES.LOGIN}
        replace
        state={{ from: location.pathname + location.search }}
      />
    );
  }

  if (allowedRoles && (!role || !allowedRoles.includes(role))) {
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};
