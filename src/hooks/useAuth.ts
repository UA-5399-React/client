import { useState } from 'react';

import { MOCK_AUTH } from '../constants';

export const useAuth = () => {
  const [isAuth] = useState(() => {
    const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
    const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);

    if (!token || !expires) return false;
    return Date.now() < Number(expires);
  });

  const logout = () => {
    localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
    localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
    localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
  };

  const role = localStorage.getItem(MOCK_AUTH.ROLE_KEY);

  return { isAuth, role, logout };
};