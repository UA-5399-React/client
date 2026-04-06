import { useEffect, useState } from 'react';

import { authService } from '@/services/authService';
import {
  clearAuthStorage,
  getStoredAuthRole,
  hasActiveAuthStorage,
  persistAuthStorage,
} from '@/utils/auth-storage';
import { isAuthRole } from '@/utils/permissions';

const hasReadyAuthState = () =>
  hasActiveAuthStorage() && getStoredAuthRole() !== null;

export const useRestoreAuthSession = () => {
  const [isReady, setIsReady] = useState(() => hasReadyAuthState());

  useEffect(() => {
    if (hasReadyAuthState()) {
      setIsReady(true);
      return;
    }

    let isCancelled = false;

    const restoreAuthSession = async () => {
      try {
        const user = await authService.getMe();

        if (isCancelled) {
          return;
        }

        if (isAuthRole(user.role)) {
          persistAuthStorage({ role: user.role });
        } else {
          clearAuthStorage();
        }
      } catch {
        if (!isCancelled) {
          clearAuthStorage();
        }
      } finally {
        if (!isCancelled) {
          setIsReady(true);
        }
      }
    };

    restoreAuthSession();

    return () => {
      isCancelled = true;
    };
  }, []);

  return isReady;
};
