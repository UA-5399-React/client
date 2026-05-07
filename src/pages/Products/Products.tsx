import { useEffect, useState } from 'react';

import { Dropdown, Pagination } from '@/components';
import { ShopBanner } from '@/components/Banner';
import type { DropdownOption } from '@/components/Dropdown';
import { ShopFilters } from '@/components/ShopFilters';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import { useProducts } from '@/hooks/useProducts';
import { useWishlistProducts } from '@/hooks/useWishlistProducts';

import { ProductsGrid } from '../../components/ProductsGrid/ProductsGrid';
import type { ViewType } from '../../components/ProductsGrid/types';
import ViewToggle from '../../components/ProductsGrid/ViewToggle';
import { SORT_OPTIONS } from './types';

import './Products.css';

export const Products = () => {
  const { wishlistIds } = useWishlistProducts();
  const [viewType, setViewType] = useState<ViewType>('grid-5');
  const [isMobile, setIsMobile] = useState(false);

  const {
    searchParams,
    currentPage,
    setPage,
    updateSearchParams,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  const defaultLimit = viewType === 'grid-5' ? 15 : 12;
  const limit = Number(searchParams.get('limit')) || defaultLimit;
  const sort = (searchParams.get('sort') as 'title' | 'price') || 'title';
  const category = searchParams
    .getAll('category')
    .flatMap((value) => value.split(','))
    .map((value) => value.trim())
    .filter(Boolean);
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

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  const { data, isLoading, isFetching, isError } = useProducts(
    currentPage,
    limit,
    sort,
    search,
    category,
    minPrice,
    maxPrice,
  );

  useEffect(() => {
    if (!data || isLoading) return;

    normalizeOutOfRangePage(data.totalPages);
  }, [data, isLoading, normalizeOutOfRangePage]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleFilterChange = (newValue: DropdownOption[]) => {
    updateSearchParams((params) => {
      const selectedSort = newValue[0]?.value;

      if (selectedSort) {
        params.set('sort', selectedSort);
      } else {
        params.delete('sort');
      }

      params.set('page', '1');
    });
  };

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

      {isLoading || isFetching || data?.items?.length ? (
        <>
          <ProductsGrid
            products={data?.items ?? []}
            viewType={viewType}
            isLoading={isLoading || isFetching}
            wishlistIds={wishlistIds}
          />
          {data && (
            <Pagination
              currentPage={currentPage}
              totalPages={data.totalPages || 1}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">No products found.</div>
      )}
    </div>
  );
};
