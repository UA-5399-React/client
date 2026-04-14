import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import googleIcon from '@/assets/icons/google-icon.webp';
import { Button, Checkbox } from '@/components';
import { Input } from '@/components';
import { MOCK_AUTH, ROUTES } from '@/constants';
import { useLogin } from '@/hooks/useLogin';
import { AuthApiError, authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import { useCartStore } from '@/store/useCartStore';
import { clearAuthStorage, persistAuthStorage } from '@/utils/auth-storage';
import { canAccessAdminPanel, isAuthRole } from '@/utils/permissions';

const loginSchema = z.object({
  email: z.string().min(1, 'Username or email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const getExpirationTime = (rememberMe?: boolean) => {
  return (Date.now() + (rememberMe ? 7 * 24 : 1) * 60 * 60 * 1000).toString();
};

export const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mutateAsync: loginMutation, isPending } = useLogin();
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string | null>(null);
  const [isResendingConfirmation, setIsResendingConfirmation] = useState(false);
  const [resendFeedback, setResendFeedback] = useState<{
    message: string;
    status: 'success' | 'error';
  } | null>(null);
  const redirectTo =
    typeof location.state?.from === 'string' ? location.state.from : null;

  const {
    register,
    handleSubmit,
    control,
    getValues,
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
      clearAuthStorage();
    }
  }, [navigate, redirectTo]);

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setUnconfirmedEmail(null);
      setResendFeedback(null);
      await loginMutation({ email: data.email, password: data.password });
      const user = await authService.getMe();

      try {
        const store = useCartStore.getState();
        const guestItems = store.items;

        let newCartItems;

        if (guestItems.length > 0) {
          const payload = guestItems.map((item) => ({
            productId: String(item.product.id || item.product._id),
            quantity: item.quantity,
          }));

          const syncedCart = await cartService.syncCart(payload);
          newCartItems = syncedCart.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          }));
        } else {
          const dbCart = await cartService.getCart();
          newCartItems = dbCart.items.map((i) => ({
            product: i.product,
            quantity: i.quantity,
          }));
        }
        store.setCart(newCartItems);
      } catch (err) {
        console.error('Failed to sync cart:', err);
      }

      const expirationTime = getExpirationTime(data.rememberMe);
      if (!isAuthRole(user.role)) {
        throw new Error('Unsupported user role');
      }

      persistAuthStorage({
        role: user.role,
        expiresAt: Number(expirationTime),
      });

      if (redirectTo) {
        navigate(redirectTo, { replace: true });
        return;
      }

      if (canAccessAdminPanel(isAuthRole(user.role) ? user.role : null)) {
        navigate(ROUTES.ADMIN);
      } else {
        navigate(ROUTES.SHOP);
      }
    } catch (error) {
      const isEmailNotConfirmed =
        error instanceof AuthApiError && error.code === 'EMAIL_NOT_CONFIRMED';

      setUnconfirmedEmail(isEmailNotConfirmed ? data.email : null);
      setResendFeedback(null);
      setError('root', {
        type: 'server',
        message: isEmailNotConfirmed
          ? 'Please confirm your email before signing in.'
          : 'Invalid email or password. Please try again.',
      });
    }
  };

  const handleResendConfirmation = async () => {
    const email = unconfirmedEmail ?? getValues('email');

    if (!email) {
      return;
    }

    setIsResendingConfirmation(true);
    setResendFeedback(null);

    try {
      const response = await authService.resendConfirmation(email);
      setResendFeedback({
        message: response.message,
        status: 'success',
      });
    } catch (error) {
      setResendFeedback({
        message:
          error instanceof Error
            ? error.message
            : 'Failed to resend confirmation email.',
        status: 'error',
      });
    } finally {
      setIsResendingConfirmation(false);
    }
  };

  const handleGoogleAuth = () => {
    authService.startGoogleAuth(redirectTo ?? undefined);
  };

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-(rgb(var(--color-text))) text-4xl font-medium">
          Sign In
        </h2>
        <p className="text-(rgb(var(--color-text))) mt-2 text-sm">
          Don't have an account yet?{' '}
          <Link to={ROUTES.REGISTER} className="font-medium hover:opacity-80">
            <span className="text-green-500">Sign Up</span>
          </Link>
        </p>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          clearErrors('root');
          setUnconfirmedEmail(null);
          setResendFeedback(null);
        }}
        className="space-y-6"
      >
        <Button
          type="button"
          onClick={handleGoogleAuth}
          className="bg-primary hover:bg-primary/85 focus:ring-primary/30 box-border inline-flex w-full items-center justify-center rounded-lg border border-transparent px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:outline-none"
        >
          <span className="flex items-center gap-3">
            <img
              src={googleIcon}
              alt=""
              aria-hidden="true"
              className="h-5 w-5 rounded-sm bg-white/90 p-0.5"
            />
            <span>Continue with Google</span>
          </span>
        </Button>

        <div className="flex items-center gap-4">
          <span className="bg-fieldBorder/80 h-px flex-1" />
          <span className="text-muted shrink-0 text-xs font-medium tracking-[0.2em] uppercase">
            or
          </span>
          <span className="bg-fieldBorder/80 h-px flex-1" />
        </div>

        <Input
          {...register('email')}
          variant="underlined"
          inputClassName="text-text bg-background"
          placeholder="Your email address"
          state={errors.email ? 'error' : 'default'}
          helperText={errors.email?.message}
          className="pb-2"
        />

        <Input
          {...register('password')}
          type="password"
          inputClassName="text-text bg-background"
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
                labelClassName="text-sm text-[rgb(var(--color-gray-600))] dark:text-[rgb(var(--color-gray-600))]"
                checkboxClassName="h-5 w-5 rounded border-gray-300 bg-[rgb(var(--color-gray-50))] dark:bg-white dark:hover:bg-[rgb(var(--color-gray-50))]"
              />
            )}
          />

          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="text-sm font-semibold text-gray-900 hover:underline dark:text-gray-300"
          >
            Forgot password?
          </Link>
        </div>

        {errors.root && (
          <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-300">
            {errors.root.message}
          </p>
        )}

        {unconfirmedEmail && (
          <div>
            <Button
              type="button"
              onClick={handleResendConfirmation}
              disabled={isResendingConfirmation}
              className="box-border inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3.5 text-center text-sm font-medium text-gray-900 transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isResendingConfirmation
                ? 'Sending confirmation email...'
                : 'Resend confirmation email'}
            </Button>
            {resendFeedback && (
              <div
                className={
                  resendFeedback.status === 'success'
                    ? 'mt-6 rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
                    : 'mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
                }
              >
                {resendFeedback.message}
              </div>
            )}
          </div>
        )}

        <Button
          type="submit"
          disabled={isPending}
          className="bg-bgSecInverted mt-6 w-full cursor-pointer rounded-lg px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none dark:text-black"
        >
          {isPending ? 'Signing in...' : 'Sign In'}
        </Button>
      </form>
    </div>
  );
};
