import { NewArrivals } from '@/components';
import { Features, Newsletter, SaleBanner } from '@/components';
import { NEW_ARRIVALS_LIMIT } from '@/constants';
import { useProducts } from '@/hooks/useProducts';

export const Home = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useProducts(1, NEW_ARRIVALS_LIMIT, 'createdAt');

  return (
    <main className="box-border w-full overflow-x-hidden">
      <NewArrivals
        products={products?.items ?? []}
        isLoading={isLoading}
        isError={isError}
      />

      <Features />

      <SaleBanner />

      <Newsletter />
    </main>
  );
};
