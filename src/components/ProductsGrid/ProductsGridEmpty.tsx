import { AlertCircle } from 'lucide-react';

export const ProductsError = ({ message }: { message: string }) => (
  <div className="flex min-h-100 items-center justify-center rounded-lg border border-red-200 bg-red-50 p-6 dark:border-red-900/20 dark:bg-red-900/10">
    <div className="flex items-center gap-3">
      <AlertCircle className="text-red-600" size={24} />
      <div>
        <p className="text-sm font-medium text-red-900 dark:text-red-400">
          Error loading products
        </p>
        <p className="mt-1 text-sm text-red-700 dark:text-red-500">{message}</p>
      </div>
    </div>
  </div>
);

export const ProductsEmpty = () => (
  <div className="flex min-h-100 items-center justify-center rounded-lg border border-neutral-200 bg-neutral-50 p-6 dark:border-neutral-800 dark:bg-neutral-900">
    <div className="text-center">
      <p className="text-sm font-medium dark:text-neutral-300">
        No products found
      </p>
      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-500">
        Try adjusting your filters
      </p>
    </div>
  </div>
);
