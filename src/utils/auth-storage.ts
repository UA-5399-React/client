import { type AuthRole, MOCK_AUTH } from '@/constants';
import { isAuthRole } from '@/utils/permissions';

// Temporary fallback until the backend provides the real session expiration.
const DEFAULT_AUTH_SESSION_DURATION_MS = 60 * 60 * 1000;

export const clearAuthStorage = (): void => {
  localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
  localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
  localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
  localStorage.removeItem('user');
};

export const persistAuthStorage = ({
  role,
  expiresAt = Date.now() + DEFAULT_AUTH_SESSION_DURATION_MS,
}: {
  role: AuthRole;
  expiresAt?: number;
}): void => {
  localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'cookie-is-set');
  localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expiresAt.toString());
  localStorage.setItem(MOCK_AUTH.ROLE_KEY, role);
};

export const hasActiveAuthStorage = (): boolean => {
  const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
  const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);

  if (!token || !expires) {
    return false;
  }

  return Date.now() < Number(expires);
};

export const getStoredAuthRole = (): AuthRole | null => {
  const storedRole = localStorage.getItem(MOCK_AUTH.ROLE_KEY);
  return isAuthRole(storedRole) ? storedRole : null;
};
