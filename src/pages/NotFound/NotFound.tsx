import { Link } from 'react-router-dom';
import clsx from 'clsx';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';

export const NotFound = () => {
  const { isDark } = useTheme();

  return (
    <div
      className={clsx(
        'flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center',
        isDark ? 'bg-[#141718]' : 'bg-white',
      )}
    >
      <p className="text-8xl font-bold text-[#38cb89]">404</p>

      <h1
        className={clsx(
          'mt-4 text-3xl font-bold',
          isDark ? 'text-white' : 'text-[#141718]',
        )}
      >
        Page not found
      </h1>

      <p className="mt-3 max-w-md text-base text-[#6C7275]">
        The page you are looking for doesn't exist or has been moved.
      </p>

      <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row">
        <Button
          onClick={() => (window.location.href = ROUTES.HOME)}
          className="h-11 rounded-lg bg-[#38cb89] px-6 text-sm font-medium text-white hover:!bg-[#2fb377]"
        >
          Go to Home
        </Button>

        <Link
          to={ROUTES.SHOP}
          className={clsx(
            'text-sm font-medium underline-offset-2 hover:underline',
            isDark ? 'text-gray-300' : 'text-[#6C7275]',
          )}
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
};
