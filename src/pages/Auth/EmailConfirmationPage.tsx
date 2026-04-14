import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants';
import { authService } from '@/services/authService';

const DEFAULT_ERROR_MESSAGE =
  'We could not confirm your email. Please try the link again or request a new confirmation email later.';

type ConfirmationState = {
  message: string | null;
  status: 'loading' | 'success' | 'error';
  token: string | null;
};

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const mountedRef = useRef(false);
  const startedTokenRef = useRef<string | null>(null);
  const activeTokenRef = useRef<string | null>(null);
  const [confirmation, setConfirmation] = useState<ConfirmationState>({
    message: null,
    status: 'loading',
    token: null,
  });
  const isTokenMissing = !token;
  const resolvedStatus = isTokenMissing
    ? 'error'
    : confirmation.token === token
      ? confirmation.status
      : 'loading';
  const resolvedMessage = isTokenMissing
    ? 'Confirmation token is missing.'
    : confirmation.token === token
      ? confirmation.message
      : null;

  useEffect(() => {
    mountedRef.current = true;

    return () => {
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    if (isTokenMissing) {
      activeTokenRef.current = null;
      return;
    }

    if (startedTokenRef.current === token) {
      return;
    }

    startedTokenRef.current = token;
    activeTokenRef.current = token;

    authService
      .confirmEmail(token)
      .then((response) => {
        if (!mountedRef.current || activeTokenRef.current !== token) {
          return;
        }

        setConfirmation({
          message: response.message,
          status: 'success',
          token,
        });
      })
      .catch((error: unknown) => {
        if (!mountedRef.current || activeTokenRef.current !== token) {
          return;
        }

        setConfirmation({
          message:
            error instanceof Error ? error.message : DEFAULT_ERROR_MESSAGE,
          status: 'error',
          token,
        });
      });
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
