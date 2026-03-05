const SkeletonCard = () => (
  <div className="animate-pulse rounded-lg border border-neutral-100 bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-800">
    <div className="aspect-square rounded-lg bg-neutral-200 dark:bg-neutral-700" />
    <div className="space-y-3 p-4">
      <div className="h-4 w-3/4 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="h-4 w-1/2 rounded bg-neutral-200 dark:bg-neutral-700" />
      <div className="mt-auto h-10 rounded bg-neutral-200 dark:bg-neutral-700" />
    </div>
  </div>
);

export const ProductsSkeleton = ({
  count = 8,
  gridClass,
}: {
  count?: number;
  gridClass: string;
}) => (
  <div className={`grid gap-4 sm:gap-5 lg:gap-6 ${gridClass}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);
