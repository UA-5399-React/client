import { generatePath, useNavigate } from 'react-router-dom';
import clsx from 'clsx';
import { KeyRound, Pencil, Trash } from 'lucide-react';

import { ActionMenu, Checkbox, Dropdown, TableSortControl } from '@/components';
import { UserAvatar } from '@/components/UserAvatar';
import { ROUTES } from '@/constants';
import {
  USER_ROLE_EDIT_OPTIONS,
  USER_STATUS_EDIT_OPTIONS,
} from '@/constants/adminUsers';
import { useConfirmModal } from '@/hooks/useConfirmModal';
import { useDeleteAdminUser } from '@/hooks/useDeleteAdminUser';
import { useUpdateAdminUser } from '@/hooks/useUpdateAdminUser';
import { authService } from '@/services/authService';
import { useErrorStore } from '@/store/errorStore';
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
  const showMessage = useErrorStore((s) => s.show);

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
      onConfirm: () =>
        deleteUser(id).then(() => {
          showMessage(
            'success',
            'User deleted',
            'The user has been deleted successfully',
          );
        }),
    });
  };

  const handleResetPassword = (email: string) => {
    authService
      .requestPasswordReset(email)
      .then(() =>
        showMessage(
          'success',
          'Password reset sent',
          `A reset link has been sent to ${email}`,
        ),
      )
      .catch((e: Error) =>
        showMessage('error', 'Failed to send reset link', e.message),
      );
  };

  if (!items.length) {
    return (
      <div className="border-fieldBorder bg-neutral-0 text-muted dark:bg-backgroundSec mt-5 rounded-lg border p-8 text-center shadow-md">
        No users found
      </div>
    );
  }
  return (
    <div className="border-fieldBorder mt-5 rounded-lg border shadow-md">
      <table className="[&_td]:border-fieldBorder [&_thead_th]:border-fieldBorder w-full border-collapse rounded-t-lg [&_td]:border-b [&_thead_th]:border-b [&_thead_th]:px-4">
        <thead className="text-muted h-[56px] bg-gray-50">
          <tr>
            <th className="text-left">
              <div className="flex items-center gap-2">
                <Checkbox className="h-[20px] w-[20px]" />
                <span>User</span>
              </div>
            </th>
            <th className="text-left">Status</th>
            <th className="hidden text-left sm:table-cell">Email</th>
            <th className="hidden text-left sm:table-cell">Role</th>
            <th className="text-left">
              <TableSortControl
                label="Activity"
                field="lastLoginAt"
                currentSort={lastLoginSort ? 'lastLoginAt' : ''}
                currentOrder={lastLoginSort ?? 'asc'}
                onSortChange={() =>
                  onLastLoginSortChange(
                    lastLoginSort === 'asc' ? 'desc' : 'asc',
                  )
                }
              />
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
          {items.map((user) => {
            const currentStatus = user.isActive ? 'active' : 'blocked';
            const currentRole = user.role;

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

                <td className="text-text hidden text-base sm:table-cell">
                  {user.email}
                </td>

                <td className="hidden sm:table-cell">
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
                  <div className="pr-2">
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
                          id: 'reset-password',
                          label: 'Reset Password',
                          icon: <KeyRound className="h-[20px] w-[20px]" />,
                          onClick: () => handleResetPassword(user.email),
                        },
                        {
                          id: 'delete',
                          label: 'Delete',
                          icon: <Trash className="h-[20px] w-[20px]" />,
                          onClick: () => handleDeleteUser(user.id),
                          variant: 'danger',
                        },
                      ]}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
