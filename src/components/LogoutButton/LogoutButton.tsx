import React from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants';

export const LogoutButton: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('token_expires');
    localStorage.removeItem('role');
    navigate(ROUTES.ADMIN_LOGIN);
  };

  return (
    <button
      onClick={handleLogout}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600"
    >
      Logout
    </button>
  );
};
