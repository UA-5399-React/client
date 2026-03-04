import { Pencil, Trash } from 'lucide-react';

import { Button, Checkbox } from '@/components';
import { useTheme } from '@/hooks/useTheme';

export function AdminProducts() {
  const { isDark } = useTheme();
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
            className={`${isDark ? 'text-black' : 'text-white'} [&_td]:px-4 [&_td]:text-center`}
          >
            <tr className="h-[80px] text-center">
              <td>
                <div className="flex items-center gap-2">
                  <Checkbox className="h-[20px] w-[20px]" />
                  <span>Image</span>
                </div>
              </td>

              <td>Product 1</td>
              <td>Active</td>
              <td>$10</td>
              <td>lorem ipsum dolor sit amet</td>
              <td>
                <Button className="hover:bg- bg-transparent text-[#DB162D]">
                  <Trash className="h-[20px] w-[20px]" />
                </Button>

                <Button className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black">
                  <Pencil />
                </Button>
              </td>
            </tr>
            <tr className="h-[80px] text-center">
              <td>
                <div className="flex items-center gap-2">
                  <Checkbox className="h-[20px] w-[20px]" />
                  <span>Image</span>
                </div>
              </td>

              <td>Product 1</td>
              <td>Draft</td>
              <td>$10</td>
              <td>lorem ipsum dolor sit amet</td>
              <td>
                <Button className="hover:bg- bg-transparent text-[#DB162D]">
                  <Trash className="h-[20px] w-[20px]" />
                </Button>

                <Button className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black">
                  <Pencil />
                </Button>
              </td>
            </tr>
          </tbody>
        </table>

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
