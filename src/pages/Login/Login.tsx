import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);

      if (email === 'admin@gmail.com' && password === 'admin123') {
        localStorage.setItem('userRole', 'admin');
        navigate(ROUTES.HOME);
      } else if (email === 'user@gmail.com' && password === 'user123') {
        localStorage.setItem('userRole', 'user');
        navigate(ROUTES.HOME);
      } else {
        alert('Wrong email and password');
      }
    }, 1000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white p-6">
      <div className="w-full max-w-[400px]">
        <h1 className="mb-2 text-[40px] font-medium text-gray-900">Sign In</h1>
        <p className="mb-10 text-sm text-gray-500">
          Don't have an account yet?{' '}
          <span className="cursor-pointer font-medium text-emerald-500">
            Sign Up
          </span>
        </p>

        <form onSubmit={handleLogin} className="flex flex-col gap-8">
          <div className="border-b border-gray-200 pb-2 transition-all focus-within:border-black">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Your username or email
            </label>
            <input
              type="email"
              className="w-full bg-transparent py-1 outline-none"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="border-b border-gray-200 pb-2 transition-all focus-within:border-black">
            <label className="text-xs font-bold text-gray-400 uppercase">
              Password
            </label>
            <input
              type="password"
              className="w-full bg-transparent py-1 outline-none"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full rounded-lg bg-black py-3 font-semibold text-white transition-all hover:bg-gray-800 disabled:bg-gray-400"
          >
            {isProcessing ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};
