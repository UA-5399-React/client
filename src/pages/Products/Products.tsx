import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Dropdown, Pagination } from '@/components';
import { ShopBanner } from '@/components/Banner';
import type { DropdownOption } from '@/components/Dropdown';
import { ShopFilters } from '@/components/ShopFilters';
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
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const search = searchParams.get('search') || undefined;

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

  const { data, isLoading, isError } = useProducts(
    page,
    limit,
    sort,
    search,
    category,
    minPrice,
    maxPrice,
  );

  const handlePageChange = (newPage: number) => {
    setSearchParams((prev) => {
      prev.set('page', String(newPage));
      return prev;
    });
  };

  const handleFilterChange = (newValue: DropdownOption[]) => {
    setSearchParams((prev) => {
      const selectedSort = newValue[0]?.value;

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

  return (
    <div className="box-border w-full overflow-x-hidden px-4 py-8 lg:px-16">
      <ShopBanner />
      <div className="mt-6 flex w-full flex-col gap-4 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
        <div className="w-full lg:w-auto">
          <ShopFilters />
        </div>

        <div className="flex w-full items-center justify-between gap-4 lg:w-auto lg:justify-end lg:gap-5">
          <div className="flex-1 lg:flex-none">
            <Dropdown
              label=""
              options={SORT_OPTIONS}
              placeholder={sort ? `Sort by ${sort}` : 'Sort by'}
              onChange={handleFilterChange}
              hasBorder={false}
              multiple={false}
            />
          </div>

          <ViewToggle
            value={viewType}
            onChange={setViewType}
            isMobile={isMobile}
          />
        </div>
      </div>
      {!data?.items?.length ? (
        <div className="p-8 text-center text-gray-500">No products found.</div>
      ) : (
        <>
          <ProductsGrid products={data.items} viewType={viewType} />
          <Pagination
            currentPage={page}
            totalPages={data.totalPages || 1}
            onPageChange={handlePageChange}
          />
        </>
      )}
    </div>
  );
};
