import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Pagination } from '@/components';
import { ShopBanner } from '@/components/Banner';
import { useProducts } from '@/hooks/useProducts';

import { ProductsGrid } from '../../components/ProductsGrid/ProductsGrid';
import type { ViewType } from '../../components/ProductsGrid/types';
import ViewToggle from '../../components/ProductsGrid/ViewToggle';

import './Products.css';

export const Products = () => {
  const [viewType, setViewType] = useState<ViewType>('grid-4');
  const [isMobile, setIsMobile] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const limit = Number(searchParams.get('limit')) || 12;

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

  const { data, isLoading, isError } = useProducts(page, limit);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });
    scrollTo({ top: 500, behavior: 'smooth' });
  };

  if (isLoading)
    return <div className="p-8 text-center text-gray-500">Loading...</div>;
  if (isError)
    return (
      <div className="p-8 text-center text-red-500">Something went wrong.</div>
    );
  if (!data?.items?.length)
    return (
      <div className="p-8 text-center text-gray-500">No products found.</div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <ShopBanner />
      <ViewToggle value={viewType} onChange={setViewType} isMobile={isMobile} />
      <ProductsGrid products={data.items} viewType={viewType} />
      <Pagination
        currentPage={page}
        totalPages={data.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
