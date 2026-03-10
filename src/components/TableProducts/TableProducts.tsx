import { useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { AlertCircle, Copy, Pencil, Trash } from 'lucide-react';

import { ROUTES } from '@/constants';
import { useTheme } from '@/hooks/useTheme';
import type { Product } from '@/types';

import { Button } from '../Button';
import { Checkbox } from '../Checkbox';

interface TableProductsProps {
  items: Product[] | [];
  loading: boolean;
  error?: Error | null;
  onDuplicate: (id: string) => void;
}

function renderBodyContent(
  loading: boolean,
  error: Error | null,
  items: Product[] | [],
  isDark: boolean,
  navigate: ReturnType<typeof useNavigate>,
  onDuplicate: (id: string) => void,
) {
  if (loading) {
    return (
      <tr>
        <td colSpan={6}>Loading...</td>
      </tr>
    );
  }
  if (error) {
    return (
      <tr role="alert">
        <td colSpan={6} className="py-8">
          <div
            className={clsx(
              'mx-auto flex max-w-md items-center gap-3 rounded-lg border p-4',
              {
                'border-red-900/50 bg-red-950/30 text-red-300': isDark,
                'border-red-200 bg-red-50 text-red-800': !isDark,
              },
            )}
          >
            <AlertCircle className="h-6 w-6 shrink-0" />
            <div className="text-left">
              <p className="font-medium">Failed to load products</p>
              <p className="text-sm">{error.message}</p>
            </div>
          </div>
        </td>
      </tr>
    );
  }
  if (!items?.length) {
    return (
      <tr>
        <td
          colSpan={6}
          className={clsx('py-8 text-center', {
            'text-black': isDark,
            'text-[#8A92A6]': !isDark,
          })}
        >
          No products found
        </td>
      </tr>
    );
  }
  return items.map((item: Product) => (
    <tr
      className="h-[80px] text-center text-[rgb(var(--color-text))]"
      key={item.id}
    >
      <td>
        <div className="flex items-center gap-2">
          <Checkbox className="h-[20px] w-[20px]" />
          <span>Image</span>
        </div>
      </td>
      <td>{item.title}</td>
      <td>{item.status}</td>
      <td>{item.price}</td>
      <td>{item.description}</td>
      <td>
        <Button className="hover:bg- bg-transparent text-[#DB162D]">
          <Trash className="h-[20px] w-[20px]" />
        </Button>
        <Button
          className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
          onClick={() => navigate(`${ROUTES.ADMIN_PRODUCTS}/${item.id}`)}
        >
          <Pencil />
        </Button>
        <Button
          className="bg-transparent text-gray-500 hover:text-black"
          onClick={() => onDuplicate(item.id)}
        >
          <Copy />
        </Button>
      </td>
    </tr>
  ));
}

export function TableProducts({
  items,
  loading,
  error,
  onDuplicate,
}: TableProductsProps) {
  const { isDark } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="mx-5 mt-5 rounded-l-lg rounded-r-lg border border-[#e5e7eb] shadow-md">
      <table className="w-full border-collapse overflow-hidden rounded-t-lg [&_td]:border-b [&_td]:border-[#e5e7eb] [&_thead_th]:border-b [&_thead_th]:border-[#e5e7eb] [&_thead_th]:px-4">
        <thead className="h-[50px] bg-[#F9FAFB] px-[12px] text-[#8A92A6]">
          <tr>
            <th>
              <div className="flex items-center gap-2">
                <Checkbox className="h-[20px] w-[20px]" />
                <span>Image</span>
              </div>
            </th>
            <th>Name</th>
            <th>Status</th>
            <th>Price</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>

        <tbody
          className={`bg-[rgb(var(--color-bg-sec))] [&_td]:px-4 [&_td]:text-center`}
        >
          {renderBodyContent(
            loading,
            error ?? null,
            items,
            isDark,
            navigate,
            onDuplicate,
          )}
        </tbody>
      </table>
    </div>
  );
}
