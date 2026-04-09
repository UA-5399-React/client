import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { ROUTES } from '@/constants';
import { authService } from '@/services/authService';

const schema = z.object({
  email: z.string().min(1, 'Email is required').email('Enter a valid email'),
});

type FormValues = z.infer<typeof schema>;

export const ForgotPasswordPage = () => {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [serverMessage, setServerMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormValues) => {
    try {
      setStatus('loading');
      const res = await authService.requestPasswordReset(data.email);
      setServerMessage(res.message);
      setStatus('success');
    } catch (error) {
      setServerMessage(
        error instanceof Error ? error.message : 'Something went wrong.',
      );
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-text text-4xl font-medium">Check your email</h2>
          <p className="text-text mt-2 text-sm">
            {serverMessage ??
              'If this email is registered, a reset link has been sent.'}
          </p>
        </div>

        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-4 text-sm text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300">
          Please check your inbox and follow the link to reset your password.
        </div>

        <div className="mt-6">
          <Link
            to={ROUTES.LOGIN}
            className="box-border inline-flex w-full items-center justify-center rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
          >
            Back to Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-text text-4xl font-medium">Forgot password</h2>
        <p className="text-text mt-2 text-sm">
          Enter your email and we'll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input
          {...register('email')}
          variant="underlined"
          inputClassName="text-text bg-background"
          placeholder="Your email address"
          state={errors.email ? 'error' : 'default'}
          helperText={errors.email?.message}
          className="pb-2"
        />

        {serverMessage && status === 'idle' && (
          <p className="text-center text-sm font-medium text-red-500">
            {serverMessage}
          </p>
        )}

        <Button
          type="submit"
          disabled={status === 'loading'}
          className="bg-bgSecInverted mt-6 w-full cursor-pointer rounded-lg px-4 py-3.5 text-center text-sm font-medium text-white transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none dark:text-black"
        >
          {status === 'loading' ? 'Sending...' : 'Send reset link'}
        </Button>
      </form>

      <div className="mt-4 text-center">
        <Link
          to={ROUTES.LOGIN}
          className="text-sm font-medium text-gray-700 hover:opacity-80 dark:text-gray-300"
        >
          Back to Sign In
        </Link>
      </div>
    </div>
  );
};
