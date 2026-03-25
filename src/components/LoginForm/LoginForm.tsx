import React, { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Checkbox } from '@/components';
import { Input } from '@/components';
import { MOCK_AUTH, ROUTES } from '@/constants';
import { useLogin } from '@/hooks/useLogin';
import { authService } from '@/services/authService';
import { canAccessAdminPanel, isAuthRole } from '@/utils/permissions';

const loginSchema = z.object({
  email: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const clearAuthData = () => {
  localStorage.removeItem(MOCK_AUTH.TOKEN_KEY);
  localStorage.removeItem(MOCK_AUTH.EXPIRES_KEY);
  localStorage.removeItem(MOCK_AUTH.ROLE_KEY);
};

const getExpirationTime = (rememberMe?: boolean) => {
  return (Date.now() + (rememberMe ? 7 * 24 : 1) * 60 * 60 * 1000).toString();
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: loginMutation, isPending } = useLogin();
  const redirectTo =
    typeof location.state?.from === 'string' ? location.state.from : null;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    setError,
    clearErrors,
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  useEffect(() => {
    const token = localStorage.getItem(MOCK_AUTH.TOKEN_KEY);
    const expires = localStorage.getItem(MOCK_AUTH.EXPIRES_KEY);
    const storedRole = localStorage.getItem(MOCK_AUTH.ROLE_KEY);
    const role = isAuthRole(storedRole) ? storedRole : null;

    if (token && expires && Date.now() < Number(expires)) {
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (canAccessAdminPanel(role)) {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.SHOP);
      }
    } else {
      clearAuthData();
    }
  }, [navigate, redirectTo]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      await loginMutation({ email: data.email, password: data.password });
      const user = await authService.getMe();

      const expirationTime = getExpirationTime(data.rememberMe);
      localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'cookie-is-set');
      localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, expirationTime);
      localStorage.setItem(MOCK_AUTH.ROLE_KEY, user.role);

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (canAccessAdminPanel(isAuthRole(user.role) ? user.role : null)) {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.SHOP);
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      setError('root', {
        type: 'server',
        message: 'Invalid email or password. Please try again.',
      });
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-4xl font-medium text-gray-900">Sign In</h2>
        <p className="mt-2 text-sm text-gray-500">
          Don't have an account yet?{' '}
          <Link to={ROUTES.REGISTER} className="font-medium hover:opacity-80">
            <span className="text-green-500">Sign Up</span>
          </Link>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => clearErrors('root')}
        className="space-y-6"
      >
        <Input
          {...register('email')}
          variant="underlined"
          inputClassName="bg-white text-black"
          placeholder="Your email address"
          state={errors.email ? 'error' : 'default'}
          helperText={errors.email?.message}
          className="pb-2"
        />

        <Input
          {...register('password')}
          type="password"
          inputClassName="bg-white text-black"
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

        {errors.root && (
          <p className="text-center text-sm font-medium text-red-500">
            {errors.root.message}
          </p>
        )}
        <button
          type="submit"
          disabled={isPending}
          className="mt-6 w-full cursor-pointer rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white transition-colors hover:bg-black focus:ring-4 focus:ring-gray-300 focus:outline-none"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};
