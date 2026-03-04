import { Button, Checkbox } from '@/components';

export function AdminProducts() {
  return (
    <div>
      <div className="border-b border-[#CFCFCF] p-5">
        <h1 className="text-2xl font-bold">Hello, Admin</h1>
      </div>

      <div className="mx-5 mt-5 rounded-lg border border-[#e5e7eb] shadow-md">
        <table className="w-full overflow-hidden rounded-lg border [&_thead_th]:px-4">
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

          <tbody className="text-black [&_td]:px-4 [&_td]:text-center">
            <tr className="text-center">
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
                <Button>Edit</Button>
                <Button>Delete</Button>
              </td>
            </tr>
            <tr className="text-center">
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
                <Button>Edit</Button>
                <Button>Delete</Button>
              </td>
            </tr>
          </tbody>
        </table>

        <div className="flex items-center justify-between">
          <Button>Previous</Button>
          <span> Page 1 of 10</span>
          <Button>Next</Button>
        </div>
      </div>
    </div>
  );
}
