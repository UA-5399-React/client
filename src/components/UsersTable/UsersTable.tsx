import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { ArrowDown, ArrowUp, ArrowUpDown, Pencil, Trash } from 'lucide-react';

import { ActionMenu, Checkbox, Dropdown } from '@/components';
import { UserAvatar } from '@/components/UserAvatar';
import { ROUTES } from '@/constants';
import {
  USER_ROLE_EDIT_OPTIONS,
  USER_STATUS_EDIT_OPTIONS,
} from '@/constants/adminUsers';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDeleteAdminUser } from '@/hooks/useDeleteAdminUser';
import { useUpdateAdminUser } from '@/hooks/useUpdateAdminUser';
import type {
  AdminUser,
  UserLastLoginSortOrder,
  UserRoleValue,
} from '@/types/admin-user.types';

interface UsersTableProps {
  items: AdminUser[];
  lastLoginSort: UserLastLoginSortOrder | null;
  onLastLoginSortChange: (order: UserLastLoginSortOrder) => void;
}

const getFullName = (user: AdminUser) => {
  const fullName = [user.firstName, user.lastName]
    .filter((value): value is string => Boolean(value?.trim()))
    .join(' ');

  return fullName || '_';
};

const getActivityLabel = (dateString: string | undefined) => {
  if (!dateString) return 'Never';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return 'Unknown';

  const diffInMs = new Date().getTime() - date.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  return `${diffInDays} days ago`;
};

export function UsersTable({
  items,
  lastLoginSort,
  onLastLoginSortChange,
}: UsersTableProps) {
  const navigate = useNavigate();
  const { handleUpdate, isUpdating } = useUpdateAdminUser();
  const { deleteUser, loading: isDeleting } = useDeleteAdminUser();
  const { openConfirmModal } = useConfirmModal();

  const handleStatusChange = async (
    userId: string,
    selected: { value: string }[],
  ) => {
    const newValue = selected[0]?.value;
    if (newValue) {
      await handleUpdate(userId, { isActive: newValue === 'ACTIVE' });
    }
  };

  const handleRoleChange = async (
    userId: string,
    selected: { value: string }[],
  ) => {
    const newValue = selected[0]?.value;
    if (newValue && newValue !== 'all') {
      await handleUpdate(userId, { role: newValue as UserRoleValue });
    }
  };

  const handleDeleteUser = (id: string) => {
    openConfirmModal({
      title: 'Delete User',
      description: 'Are you sure you want to delete this user?',
      isCritical: true,
      confirmText: 'Delete',
      onConfirm: () => deleteUser(id),
    });
  };

  if (!items.length) {
    return (
      <div className="border-fieldBorder bg-neutral-0 text-muted dark:bg-backgroundSec mt-5 rounded-lg border p-8 text-center shadow-md">
        No users found
      </div>
    );
  }
  return (
    <div className="border-fieldBorder mt-5 overflow-x-auto rounded-lg border shadow-md">
      <table className="[&_td]:border-fieldBorder [&_thead_th]:border-fieldBorder w-full border-collapse rounded-t-lg [&_td]:border-b [&_thead_th]:border-b [&_thead_th]:px-4">
        <thead className="text-muted h-[56px] bg-gray-50">
          <tr>
            <th className="w-[280px] text-left">
              <div className="flex items-center gap-2">
                <Checkbox className="h-[20px] w-[20px]" />
                <span>User</span>
              </div>
            </th>
            <th className="text-left">Status</th>
            <th className="text-left">Email</th>
            <th className="text-left">Role</th>
            <th className="text-left">
              <button
                className="flex cursor-pointer items-center gap-1 font-semibold"
                onClick={() =>
                  onLastLoginSortChange(
                    lastLoginSort === 'asc' ? 'desc' : 'asc',
                  )
                }
              >
                Activity
                {lastLoginSort === 'asc' ? (
                  <ArrowUp size={14} />
                ) : lastLoginSort === 'desc' ? (
                  <ArrowDown size={14} />
                ) : (
                  <ArrowUpDown size={14} className="text-muted" />
                )}
              </button>
            </th>
            <th className="w-[80px]"></th>
          </tr>
        </thead>

        <tbody
          className={clsx(
            'bg-neutral-0 dark:bg-backgroundSec [&_td]:px-4 [&_td]:py-5 [&_td]:text-left',
            (isUpdating || isDeleting) && 'pointer-events-none opacity-50',
          )}
        >
          {items.map((user, index) => {
            const currentStatus = user.isActive ? 'active' : 'blocked';
            const currentRole = user.role;
            const shouldOpenUpward = index >= items.length - 2;

            return (
              <tr key={user.id} className="text-text text-base">
                <td>
                  <div className="flex items-center gap-3">
                    <Checkbox className="h-[20px] w-[20px]" />
                    <UserAvatar user={user} />
                    <span className="text-text text-base font-medium">
                      {getFullName(user)}
                    </span>
                  </div>
                </td>

                <td>
                  <Dropdown
                    label="Status"
                    labelClassName="hidden"
                    options={[...USER_STATUS_EDIT_OPTIONS]}
                    selectedValues={[currentStatus.toUpperCase()]}
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
                        '!flex !h-8 !min-w-[140px] !items-center !justify-between',
                        '!whitespace-nowrap !rounded-[10px] !border !border-fieldBorder !bg-neutral-0 !px-3 !py-0 !text-sm !font-normal !shadow-none hover:!bg-gray-50',
                        '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-blue-500',
                        currentStatus === 'active'
                          ? '!text-primary'
                          : '!text-red-700',
                      )
                    }
                  />
                </td>

                <td className="text-text text-base">{user.email}</td>

                <td>
                  <Dropdown
                    label="Role"
                    labelClassName="hidden"
                    options={[...USER_ROLE_EDIT_OPTIONS]}
                    selectedValues={[currentRole.toUpperCase()]}
                    onChange={(selected) =>
                      handleRoleChange(user.id, selected as { value: string }[])
                    }
                    placeholder="Role"
                    multiple={false}
                    hasBorder={true}
                    selectClassName={
                      ' ' +
                      clsx(
                        '!flex !h-10 !min-w-[170px] !items-center !justify-between',
                        '!whitespace-nowrap !rounded-[10px] !border !border-fieldBorder !bg-neutral-0 !px-3 !py-0 !text-sm !font-normal !text-neutral-800 !shadow-none hover:!bg-gray-50',
                        '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-blue-500',
                      )
                    }
                  />
                </td>

                <td className="text-text text-base">
                  {getActivityLabel(user.lastLoginAt)}
                </td>

                <td className="relative text-right">
                  <ActionMenu
                    triggerAriaLabel={`Actions for ${getFullName(user)}`}
                    actions={[
                      {
                        id: 'edit',
                        label: 'Edit',
                        icon: <Pencil className="h-[20px] w-[20px]" />,
                        onClick: () =>
                          navigate(
                            generatePath(ROUTES.ADMIN_USER_EDIT, {
                              id: user.id,
                            }),
                          ),
                      },
                      {
                        id: 'delete',
                        label: 'Delete',
                        icon: <Trash className="h-[20px] w-[20px]" />,
                        onClick: () => handleDeleteUser(user.id),
                        variant: 'danger',
                      },
                    ]}
                    className={clsx(
                      'right-0 left-auto',
                      shouldOpenUpward ? 'top-auto bottom-10' : 'top-10',
                    )}
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
