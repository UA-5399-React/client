import { Link, useSearchParams } from 'react-router-dom';

import { ROUTES } from '@/constants';

const DEFAULT_ERROR_MESSAGE =
  'We could not confirm your email. Please try the link again or request a new confirmation email later.';

export const EmailConfirmationPage = () => {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');
  const message = searchParams.get('message');

  const isSuccess = status === 'success';
  const title = isSuccess ? 'Email confirmed' : 'Confirmation failed';
  const description =
    message ??
    (isSuccess
      ? 'Your email has been confirmed successfully. You can sign in now.'
      : DEFAULT_ERROR_MESSAGE);

  return (
    <div className="flex w-full max-w-md flex-col px-4 sm:px-6">
      <div className="mb-8">
        <h2 className="text-text text-4xl font-medium">{title}</h2>
        <p className="text-text mt-2 text-sm">{description}</p>
      </div>

      <div
        className={`rounded-lg border px-4 py-4 text-sm ${
          isSuccess
            ? 'border-green-200 bg-green-50 text-green-800 dark:border-green-700 dark:bg-green-900 dark:text-green-300'
            : 'border-red-200 bg-red-50 text-red-800 dark:border-red-700 dark:bg-red-900 dark:text-red-300'
        }`}
      >
        {isSuccess
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
