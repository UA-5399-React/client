import { useState } from 'react';

import { Button, SearchInput, TableProducts } from '@/components';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { useTheme } from '@/hooks/useTheme';

const LIMIT = 10;

export function AdminProducts() {
  const { isDark } = useTheme();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  // reset page immediately when yser types
  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const debouncedSearch = useDebouncedValue(search.trim(), 300);

  const { items, loading, error } = useAdminProducts({
    page,
    limit: LIMIT,
    search: debouncedSearch,
  });

  return (
    <div>
      <div className="border-b border-[#CFCFCF] p-5">
        <h1
          className={`${isDark ? 'text-black' : 'text-white'} text-2xl font-bold`}
        >
          Hello, Admin
        </h1>
      </div>

      <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        {/* Search */}
        <div className="flex w-full items-center justify-end border-b border-[#e5e7eb] p-4">
          <div className="w-full max-w-[360px]">
            <SearchInput value={search} onChange={handleSearchChange} />
          </div>
        </div>

        {/* Table */}
        <TableProducts items={items} loading={loading} error={error} />

        {/* Empty state */}
        {!loading && !error && items.length === 0 && (
          <div className="p-4 text-center text-sm text-neutral-500">
            No products found
          </div>
        )}

        <div className="flex items-center justify-between p-4">
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
