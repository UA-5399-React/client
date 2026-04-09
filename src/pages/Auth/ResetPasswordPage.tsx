import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ROUTES } from '@/constants';
import { authService } from '@/services/authService';

const schema = z
  .object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[A-Z]/, 'Must contain an uppercase letter')
      .regex(/[a-z]/, 'Must contain a lowercase letter')
      .regex(/[0-9]/, 'Must contain a number')
      .regex(/[^A-Za-z0-9]/, 'Must contain a symbol'),
    passwordConfirmation: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.passwordConfirmation, {
    message: "Passwords don't match",
    path: ['passwordConfirmation'],
  });

type FormValues = z.infer<typeof schema>;

export const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const isTokenMissing = !token;

  const onSubmit = async (data: FormValues) => {
    if (!token) return;

    try {
      setStatus('loading');
      setErrorMessage(null);
      await authService.resetPassword(
        token,
        data.password,
        data.passwordConfirmation,
      );
      setStatus('success');
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : 'Failed to reset password.',
      );
      setStatus('idle');
    }
  };

  if (isTokenMissing) {
    return (
      <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-text text-4xl font-medium">Invalid link</h2>
          <p className="text-text mt-2 text-sm">
            The reset link is missing or malformed.
          </p>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-4 text-sm text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-300">
          Please request a new password reset link.
        </div>

        <div className="mt-6 space-y-3">
          <Link
            to={ROUTES.FORGOT_PASSWORD}
            className="box-border inline-flex w-full items-center justify-center rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Request new link
          </Link>
          <Link
            to={ROUTES.LOGIN}
            className="box-border inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3.5 text-center text-sm font-medium text-gray-900 transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-text text-4xl font-medium">Password updated</h2>
          <p className="text-text mt-2 text-sm">
            Your password has been changed successfully.
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300">
          You can now sign in with your new password.
        </div>

        <div className="mt-6">
          <Button
            type="button"
            onClick={() => navigate(ROUTES.LOGIN)}
            className="bg-bgSecInverted w-full cursor-pointer rounded-lg px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none dark:text-black"
          >
            Go to Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-text text-4xl font-medium">Reset password</h2>
        <p className="text-text mt-2 text-sm">Enter your new password below.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('password')}
          type="password"
          variant="underlined"
          inputClassName="text-text bg-background"
          placeholder="New password"
          state={errors.password ? 'error' : 'default'}
          helperText={errors.password?.message}
          className="pb-2"
        />

        <Input
          {...register('passwordConfirmation')}
          type="password"
          variant="underlined"
          inputClassName="text-text bg-background"
          placeholder="Confirm new password"
          state={errors.passwordConfirmation ? 'error' : 'default'}
          helperText={errors.passwordConfirmation?.message}
          className="pb-2"
        />

        {errorMessage && (
          <p className="text-center text-sm font-medium text-red-500">
            {errorMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-bgSecInverted mt-6 w-full cursor-pointer rounded-lg px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none dark:text-black"
        >
          {status === 'loading' ? 'Updating...' : 'Set new password'}
        </Button>
      </form>
    </div>
  );
};
