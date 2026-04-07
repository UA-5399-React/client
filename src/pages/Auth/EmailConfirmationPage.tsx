import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { authService } from '@/services/authService';

const DEFAULT_ERROR_MESSAGE =
  'We could not confirm your email. Please try the link again or request a new confirmation email later.';

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const hasStartedRef = useRef(false);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(
    'loading',
  );
  const [message, setMessage] = useState<string | null>(null);
  const isTokenMissing = !token;
  const resolvedStatus = isTokenMissing ? 'error' : status;
  const resolvedMessage = isTokenMissing
    ? 'Confirmation token is missing.'
    : message;

  useEffect(() => {
    if (isTokenMissing || hasStartedRef.current) {
      return;
    }

    hasStartedRef.current = true;
    let isActive = true;

    authService
      .confirmEmail(token)
      .then((response) => {
        if (!isActive) {
          return;
        }

        setStatus('success');
        setMessage(response.message);
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        setStatus('error');
        setMessage(
          error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
        );
      });

    return () => {
      isActive = false;
    };
  }, [isTokenMissing, token]);

  const isLoading = resolvedStatus === 'loading';
  const isSuccess = resolvedStatus === 'success';
  const title = isLoading
    ? 'Confirming email'
    : isSuccess
      ? 'Email confirmed'
      : 'Confirmation failed';
  const description = isLoading
    ? 'Please wait while we verify your email address.'
    : (resolvedMessage ??
      (isSuccess
        ? 'Your email has been confirmed successfully. You can sign in now.'
        : DEFAULT_ERROR_MESSAGE));

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-text text-4xl font-medium">{title}</h2>
        <p className="text-text mt-2 text-sm">{description}</p>
      </div>

      <div
        className={`rounded-lg border px-4 py-4 text-sm ${
          isLoading
            ? 'border-gray-200 bg-gray-50 text-gray-700 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300'
            : isSuccess
              ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
              : 'border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
        }`}
      >
        {isLoading
          ? 'We are checking your confirmation link.'
          : isSuccess
            ? 'Your account is ready to use.'
            : 'The confirmation link may be invalid or expired.'}
      </div>

      <div className="mt-6 space-y-3">
        <Link
          to={ROUTES.LOGIN}
          className="box-border inline-flex w-full items-center justify-center rounded-lg bg-[#1a1c23] px-4 py-3.5 text-center text-sm font-medium text-white! transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
        >
          Go to Sign In
        </Link>

        <Link
          to={ROUTES.REGISTER}
          className="box-border inline-flex w-full items-center justify-center rounded-lg border border-gray-300 px-4 py-3.5 text-center text-sm font-medium text-gray-900 transition-colors focus:ring-4 focus:ring-gray-300 focus:outline-none"
        >
          Back to Sign Up
        </Link>
      </div>
    </div>
  );
};
