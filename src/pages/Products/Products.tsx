import { useEffect, useState } from 'react';

import { useGetProducts } from '@/hooks/useProducts';

import { ProductsGrid } from '../../components/ProductsGrid/ProductsGrid';
import type { ViewType } from '../../components/ProductsGrid/types';
import ViewToggle from '../../components/ProductsGrid/ViewToggle';

import './Products.css';

export const Products = () => {
  const [viewType, setViewType] = useState<ViewType>('grid-4');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (isMobile) setViewType('list');
    }, 800);
    return () => clearTimeout(timer);
  }, [isMobile]);

  const { data, isLoading, isError } = useGetProducts();

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Something went wrong.</div>
    );
  if (!data?.length)
    return (
      <div className="p-8 text-center text-gray-500">No products found.</div>
    );

  return (
    <>
      <ViewToggle value={viewType} onChange={setViewType} isMobile={isMobile} />
      <ProductsGrid products={data} viewType={viewType} />
    </>
  );
};
