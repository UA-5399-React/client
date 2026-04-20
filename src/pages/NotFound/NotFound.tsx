import { Link } from 'react-router-dom';

import { Button } from '@/components/Button';
import { ROUTES } from '@/constants';

export const NotFound = () => {
  return (
    <div className="bg-background flex min-h-[60vh] flex-col items-center justify-center px-4 py-20 text-center">
      <p className="text-primary text-8xl font-bold">404</p>

      <h1 className="text-text mt-4 text-3xl font-bold">Page not found</h1>

      <p className="text-muted mt-3 max-w-md text-base">
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
          className="text-muted text-sm font-medium underline-offset-2 hover:underline"
        >
          Browse Shop
        </Link>
      </div>
    </div>
  );
};
