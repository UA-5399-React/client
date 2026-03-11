import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dropdown, Pagination } from '@/components';
import { ShopBanner } from '@/components/Banner';
import type { DropdownOption } from '@/components/Dropdown';
import { useProducts } from '@/hooks/useProducts';

import { ProductsGrid } from '../../components/ProductsGrid/ProductsGrid';
import type { ViewType } from '../../components/ProductsGrid/types';
import ViewToggle from '../../components/ProductsGrid/ViewToggle';
import { SORT_OPTIONS } from './types';

import './Products.css';

export const Products = () => {
  const [viewType, setViewType] = useState<ViewType>('grid-5');
  const [isMobile, setIsMobile] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get('page')) || 1;
  const defaultLimit = viewType === 'grid-5' ? 15 : 12;
  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const sort = (searchParams.get('sort') as 'title' | 'price') || 'title';

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

  const { data, isLoading, isError } = useProducts(page, limit, sort);

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });
  };

  const handleFilterChange = (newValue: DropdownOption[]) => {
    setSearchParams((prev) => {
      const selectedSort = newValue[0] as unknown as string;

      if (selectedSort) {
        prev.set('sort', selectedSort);
      } else {
        prev.delete('sort');
      }

      prev.set('page', '1');
      return prev;
    });
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
    <div className="box-border w-full overflow-x-hidden px-4 py-8 lg:px-16">
      <ShopBanner />
      <div className="align-items flex w-full justify-end gap-5">
        <Dropdown
          label=""
          options={SORT_OPTIONS}
          placeholder={sort ? `Sort by ${sort}` : 'Sort by'}
          onChange={handleFilterChange}
          hasBorder={false}
          multiple={false}
        />
        <ViewToggle
          value={viewType}
          onChange={setViewType}
          isMobile={isMobile}
        />
      </div>
      <ProductsGrid products={data.items} viewType={viewType} />
      <Pagination
        currentPage={page}
        totalPages={data.totalPages || 1}
        onPageChange={handlePageChange}
      />
    </div>
  );
};
