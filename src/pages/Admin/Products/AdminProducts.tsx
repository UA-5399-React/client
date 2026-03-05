import { Button, TableProducts } from '@/components';
import { useAdminProducts } from '@/hooks/useAdminProduct';
import { useTheme } from '@/hooks/useTheme';

export function AdminProducts() {
  const { isDark } = useTheme();
  const { items, loading, error } = useAdminProducts();

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

      <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
        <TableProducts items={items} loading={loading} error={error} />

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
