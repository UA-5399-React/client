import { useState } from 'react';

import { Button, ProductFiltersBar, TableProducts } from '@/components';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useTheme } from '@/hooks/useTheme';
import { DEFAULT_FILTERS, type ProductsFilters } from '@/types/filters';

export function AdminProducts() {
  const { isDark } = useTheme();

  const [filters, setFilters] = useState<ProductsFilters>(DEFAULT_FILTERS);
  const { items, loading, error } = useAdminProducts(1, 10, filters);

  const [showFilters, setShowFilters] = useState(false);

  const handleFiltersChange = (newFilters: ProductsFilters) => {
    setFilters(newFilters);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="border-b border-[#CFCFCF] p-5">
        <h1
          className={`${isDark ? 'text-black' : 'text-white'} text-2xl font-bold`}
        >
          Hello, Admin
        </h1>
      </div>

      <div className="flex items-center justify-between border-b border-[#e5e7eb] px-4 py-3">
        <Button
          variant="outline"
          onClick={() => setShowFilters((prev) => !prev)}
          className="flex items-center gap-2 border-gray-300 text-gray-700"
        >
          Filters
        </Button>
      </div>

      {showFilters && (
        <div className="border-b border-[#e5e7eb] bg-gray-50 px-4 py-3 text-gray-700">
          <ProductFiltersBar filters={filters} onChange={handleFiltersChange} />
        </div>
      )}

      <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        <TableProducts items={items} loading={loading} error={error} />

        <div className="allItems-center flex justify-between p-4">
          <Button>Previous</Button>
          <span className={`${isDark ? 'text-black' : 'text-white'}`}>
            {' '}
            Page 1 of 10
          </span>
          <Button>Next</Button>
        </div>
      </div>
    </div>
  );
}
