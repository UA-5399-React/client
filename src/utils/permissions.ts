import { AUTH_ROLES, type AuthRole, ROUTES } from '@/constants';

const authRoles = new Set<AuthRole>(Object.values(AUTH_ROLES));

export const isAuthRole = (value: string | null): value is AuthRole =>
  value !== null && authRoles.has(value as AuthRole);

export const isAdminRole = (role: AuthRole | null) => role === AUTH_ROLES.ADMIN;

export const isSuperAdminRole = (role: AuthRole | null) =>
  role === AUTH_ROLES.SUPER_ADMIN;

export const isCustomerRole = (role: AuthRole | null) =>
  role === AUTH_ROLES.CUSTOMER;

export const canAccessAdminPanel = (role: AuthRole | null) =>
  isAdminRole(role) || isSuperAdminRole(role);

export const canAccessAdminRoute = (
  role: AuthRole | null,
  route: string,
): boolean => {
  if (!canAccessAdminPanel(role)) {
    return false;
  }

  if (route === ROUTES.ADMIN_USERS || route === ROUTES.ADMIN_SETTING) {
    return isSuperAdminRole(role);
  }

  return true;
};
