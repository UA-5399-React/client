import { NewArrivals } from '@/components';
import { Features, Newsletter, SaleBanner } from '@/components';
import { useProducts } from '@/hooks/useProducts';

const NEW_ARRIVALS_LIMIT = 10;

export const Home = () => {
  const {
    data: products,
    isLoading,
    isError,
  } = useProducts(1, NEW_ARRIVALS_LIMIT);

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
