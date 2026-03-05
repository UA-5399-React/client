import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AUTH_ROLES,MOCK_AUTH, ROUTES } from '../../constants';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
    const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);
    const role = localStorage.getItem(MOCK_AUTH.ROLE_KEY);

    if (token && expires && Date.now() < Number(expires)) {
      if (role === AUTH_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_PRODUCTS);
      } else {
        navigate(ROUTES.HOME);
      }
      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      localStorage.removeItem('role');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const expirationTime = (Date.now() + 60 * 60 * 1000).toString();

    if (
      email === MOCK_AUTH.ADMIN_EMAIL &&
      password === MOCK_AUTH.ADMIN_PASSWORD
    ) {
      localStorage.setItem(MOCK_AUTH.TOKEN_KEY, MOCK_AUTH.MOCK_TOKEN);
      localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expirationTime);
      localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);

      navigate(ROUTES.ADMIN_PRODUCTS);
      return;
    }

    if (
      email === MOCK_AUTH.ADMIN_EMAIL &&
      password === MOCK_AUTH.ADMIN_PASSWORD
    ) {
      localStorage.setItem(MOCK_AUTH.TOKEN_KEY, MOCK_AUTH.MOCK_TOKEN);
      localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expirationTime);
      localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);

      navigate(ROUTES.ADMIN_PRODUCTS);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'mock-user-token');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expirationTime);
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.USER);

    navigate(ROUTES.HOME);
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-6 rounded-xl border border-gray-100 bg-white p-8 shadow-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-center text-2xl font-bold text-gray-800">
            Login
          </h2>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="enter your email"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(null);
              }}
              className={`w-full rounded-lg border px-4 py-2 outline-none focus:ring-2 ${
                error
                  ? 'border-red-500 focus:ring-red-500'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
              placeholder="••••••••"
              required
            />
            {error && (
              <p className="mt-1 text-xs font-medium text-red-500">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md outline-none hover:bg-blue-700 focus:ring-2 focus:ring-blue-500"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
