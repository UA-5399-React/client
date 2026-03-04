import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ROUTES } from '../../constants';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expires = localStorage.getItem('token_expires');
    if (token && expires && Date.now() < Number(expires)) {
      navigate(ROUTES.ADMIN_PRODUCTS);
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      localStorage.removeItem('role');
    }
  }, [navigate]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (email === 'admin@gmail.com' && password === 'admin123') {
      const role = 'admin';

      localStorage.setItem('token', 'mock-jwt-token');
      const expires = Date.now() + 60 * 60 * 1000;
      localStorage.setItem('token_expires', expires.toString());
      localStorage.setItem('role', role);

      console.log(`User logged in. Email: ${email}, Role: ${role}`);
      navigate(ROUTES.ADMIN_PRODUCTS);
    } else {
      console.log('Invalid credentials');
      alert('Invalid credentials');
    }
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
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 transition-all outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white shadow-md transition-colors hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
};
