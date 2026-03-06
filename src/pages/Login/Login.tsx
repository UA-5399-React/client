import React from 'react';

import { LoginForm } from '../../components';

export const Login: React.FC = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <LoginForm />
    </div>
  );
};
