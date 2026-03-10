import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Checkbox } from '@/components';
import { Input } from '@/components';
import { AUTH_ROLES, MOCK_AUTH, ROUTES } from '@/constants';

const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getExpirationTime = (rememberMe?: boolean) => {
  return (Date.now() + (rememberMe ? 7 * 24 : 1) * 60 * 60 * 1000).toString();
};

const clearAuthData = () => {
  localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
  localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
  localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
};

const setAuthData = (token: string, expires: string, role: string) => {
  localStorage.setItem(MOCK_AUTH.TOKEN_KEY, token);
  localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expires);
  localStorage.setItem(MOCK_AUTH.ROLE_KEY, role);
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      usernameOrEmail: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
    const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);
    const role = localStorage.getItem(MOCK_AUTH.ROLE_KEY);

    if (token && expires && Date.now() < Number(expires)) {
      if (role === AUTH_ROLES.ADMIN) {
        navigate(ROUTES.ADMIN_PRODUCTS);
      } else {
        navigate('/shop');
      }
    } else {
      clearAuthData();
    }
  }, [navigate]);

  const onSubmit = (data: LoginFormValues) => {
    const expirationTime = getExpirationTime(data.rememberMe);

    const isAdminPage = location.pathname.includes('admin');

    if (isAdminPage) {
      setAuthData(MOCK_AUTH.MOCK_TOKEN, expirationTime, AUTH_ROLES.ADMIN);
      navigate(ROUTES.ADMIN_PRODUCTS);
      return;
    } else {
      setAuthData('mock-user-token', expirationTime, AUTH_ROLES.USER);
      navigate('/shop');
      return;
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-medium text-gray-900">Sign In</h2>
        <p className="mt-2 text-sm text-gray-500">
          Don't have an account yet?{' '}
          <a href="#" className="font-medium hover:opacity-80">
            <span className="text-green-500">Sign Up</span>
          </a>
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('usernameOrEmail')}
          variant="underlined"
          placeholder="Your username or email address"
          state={errors.usernameOrEmail ? 'error' : 'default'}
          helperText={errors.usernameOrEmail?.message}
          className="pb-2"
        />

        <Input
          {...register('password')}
          type="password"
          variant="underlined"
          placeholder="Password"
          state={errors.password ? 'error' : 'default'}
          helperText={errors.password?.message}
          className="pb-2"
        />

        <div className="flex items-center justify-between pt-2">
          <Controller
            control={control}
            name="rememberMe"
            render={({ field }) => (
              <Checkbox
                label="Remember me"
                checked={field.value}
                onCheckedChange={field.onChange}
                labelClassName="text-sm text-gray-500"
                checkmarkClassName={field.value ? 'text-white' : 'transparent'}
                checkboxClassName="h-5 w-5 rounded border-gray-300"
              />
            )}
          />

          <a
            href="#"
            className="text-sm font-semibold text-gray-900 hover:underline"
          >
            Forgot password?
          </a>
        </div>

        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-black focus:ring-4 focus:ring-gray-300 focus:outline-none"
        >
          Sign In
        </button>
      </form>
    </div>
  );
};
