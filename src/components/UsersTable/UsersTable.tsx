import { useState } from 'react';
import clsx from 'clsx';
import { EllipsisVertical, Pencil, Trash } from 'lucide-react';

import { Button, Checkbox, Dropdown } from '@/components';
import type { AdminUser } from '@/types/admin-user.types';

interface UsersTableProps {
  items: AdminUser[];
  onUpdateUser: (
    userId: string,
    field: 'role' | 'isActive',
    value: string | boolean,
  ) => void;
}

const statusOptions = [
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

const roleOptions = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
];

const getFullName = (user: AdminUser) => `${user.firstName} ${user.lastName}`;

const getActivityLabel = (date: string) => {
  const diffMs = Date.now() - new Date(date).getTime();
  const diffDays = Math.max(1, Math.floor(diffMs / (1000 * 60 * 60 * 24)));

  return `${diffDays} days ago`;
};

export function UsersTable({ items, onUpdateUser }: UsersTableProps) {
  const [openedMenuId, setOpenedMenuId] = useState<string | null>(null);

  const handleStatusChange = (
    userId: string,
    selected: { value: string }[],
  ) => {
    const newValue = selected[0]?.value;
    if (newValue) {
      onUpdateUser(userId, 'isActive', newValue === 'active');
    }
  };

  const handleRoleChange = (userId: string, selected: { value: string }[]) => {
    const newValue = selected[0]?.value;
    if (newValue) {
      onUpdateUser(userId, 'role', newValue);
    }
  };

  if (!items.length) {
    return (
      <div className="mt-5 rounded-lg border border-[#E5E7EB] bg-white p-8 text-center text-[#8A92A6] shadow-md">
        No users found
      </div>
    );
  }

  return (
    <div className="mt-5 rounded-lg border border-[#E5E7EB] bg-white shadow-md">
      <table className="w-full border-collapse overflow-hidden rounded-t-lg [&_td]:border-b [&_td]:border-[#E5E7EB] [&_thead_th]:border-b [&_thead_th]:border-[#E5E7EB] [&_thead_th]:px-4">
        <thead className="h-[50px] bg-[#F9FAFB] text-[#8A92A6]">
          <tr>
            <th className="w-[250px] text-left">
              <div className="flex items-center gap-2">
                <Checkbox className="h-[20px] w-[20px]" />
                <span>User</span>
              </div>
            </th>
            <th className="text-left">Status</th>
            <th className="text-left">Email</th>
            <th className="text-left">Role</th>
            <th className="text-left">Activity</th>
            <th className="w-[80px]"></th>
          </tr>
        </thead>
        <tbody className="bg-white [&_td]:px-4 [&_td]:py-4">
          {items.map((user) => {
            const currentStatus = user.isActive ? 'active' : 'blocked';
            const currentRole = user.role;

            return (
              <tr key={user.id} className="text-[rgb(var(--color-text))]">
                <td>
                  <div className="flex items-center gap-3">
                    <Checkbox className="h-[20px] w-[20px]" />
                    <img
                      src={user.avatarUrl}
                      alt={getFullName(user)}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <span className="text-sm font-medium text-[#2C2C2C]">
                      {getFullName(user)}
                    </span>
                  </div>
                </td>

                <td>
                  <Dropdown
                    label="Status"
                    labelClassName="hidden"
                    options={statusOptions}
                    selectedValues={[currentStatus]}
                    onChange={(selected) =>
                      handleStatusChange(
                        user.id,
                        selected as { value: string }[],
                      )
                    }
                    placeholder="Status"
                    multiple={false}
                    hasBorder={true}
                    selectClassName={
                      ' ' +
                      clsx(
                        '!flex !items-center !justify-between',
                        '!h-8 !w-[120px] !rounded-[10px] !border !border-[#8F96A3] !bg-white !px-3 !py-0 !text-xs !font-normal !shadow-none hover:!bg-white',
                        '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-[#2563EB]',
                        currentStatus === 'active'
                          ? '!text-[#38CB89]'
                          : '!text-[#EF4444]',
                      )
                    }
                  />
                </td>

                <td className="text-sm text-[#525252]">{user.email}</td>

                <td>
                  <Dropdown
                    label="Role"
                    labelClassName="hidden"
                    options={roleOptions}
                    selectedValues={[currentRole]}
                    onChange={(selected) =>
                      handleRoleChange(user.id, selected as { value: string }[])
                    }
                    placeholder="Role"
                    multiple={false}
                    hasBorder={true}
                    selectClassName={
                      ' ' +
                      clsx(
                        '!flex !items-center !justify-between',
                        '!h-8 !w-[120px] !rounded-[10px] !border !border-[#8F96A3] !bg-white !px-3 !py-0 !text-xs !font-normal !text-[#2C2C2C] !shadow-none hover:!bg-white',
                        '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-[#2563EB]',
                      )
                    }
                  />
                </td>

                <td className="text-sm text-[#525252]">
                  {getActivityLabel(user.updatedAt)}
                </td>

                <td className="relative">
                  <Button
                    type="button"
                    aria-label={`Actions for ${getFullName(user)}`}
                    className="bg-transparent text-gray-500 hover:bg-transparent hover:text-black"
                    onClick={() =>
                      setOpenedMenuId((prev) =>
                        prev === user.id ? null : user.id,
                      )
                    }
                  >
                    <EllipsisVertical className="h-5 w-5" />
                  </Button>

                  {openedMenuId === user.id && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setOpenedMenuId(null)}
                      />
                      <div className="absolute top-12 right-0 z-20 w-[140px] rounded-xl border border-[#E5E7EB] bg-white shadow-lg">
                        <Button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-none bg-transparent px-4 py-3 text-left text-sm text-[#2C2C2C] hover:bg-[#F9FAFB]"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Button>

                        <div className="mx-3 border-t border-[#E5E7EB]" />

                        <Button
                          type="button"
                          className="flex w-full items-center gap-2 rounded-none bg-transparent px-4 py-3 text-left text-sm text-[#DB162D] hover:bg-[#F9FAFB]"
                        >
                          <Trash className="h-4 w-4" />
                          Delete
                        </Button>
                      </div>
                    </>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
