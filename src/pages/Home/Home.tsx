import { Features, Newsletter, SaleBanner } from '@/components';
export const Home = () => {
  return (
    <main className="box-border w-full overflow-x-hidden">
      <Features />
      <SaleBanner />
      <Newsletter />
    </main>
  );
};
