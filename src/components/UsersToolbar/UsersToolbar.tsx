import clsx from 'clsx';
import { UserPlus } from 'lucide-react';

import { Button, Dropdown, SearchInput } from '@/components';
import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
} from '@/constants/adminUsers';
import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

type FilterOption = {
  label: string;
  value: string;
};

interface UsersToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;
  statusFilter: UserStatusFilter;
  setStatusFilter: (value: UserStatusFilter) => void;
  roleFilter: UserRoleFilter;
  setRoleFilter: (value: UserRoleFilter) => void;
  statusOptions: FilterOption[];
  roleOptions: FilterOption[];
  onCreateUser?: () => void;
}

export function UsersToolbar({
  searchValue,
  setSearchValue,
  statusFilter,
  setStatusFilter,
  roleFilter,
  setRoleFilter,
  statusOptions,
  roleOptions,
  onCreateUser,
}: UsersToolbarProps) {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput
          value={searchValue}
          onChange={setSearchValue}
          placeholder="Search"
        />

        <Button
          type="button"
          onClick={onCreateUser}
          className="text-neutral-0 flex h-[48px] items-center gap-2 rounded-xl bg-blue-500 px-6 text-sm font-medium transition-colors duration-300 hover:bg-blue-800"
        >
          <UserPlus className="h-[18px] w-[18px]" />
          Create user
        </Button>
      </div>

      <div className="flex flex-wrap gap-4">
        <Dropdown
          label="Status"
          labelClassName="sr-only"
          options={statusOptions}
          selectedValues={[statusFilter]}
          onChange={(selected) =>
            setStatusFilter(
              (selected[0]?.value as UserStatusFilter) ??
                DEFAULT_USER_STATUS_FILTER,
            )
          }
          placeholder="All"
          multiple={false}
          hasBorder={false}
          selectClassName={
            ' ' +
            clsx(
              '!flex !h-10 !min-w-[100px] !items-center !justify-between',
              '!rounded-xl !border !border-fieldBorder !bg-backgroundSec dark:!bg-neutral-0 !px-4 !py-0 !text-sm !font-medium !text-text dark:!text-neutral-800 !shadow-none !transition-colors !duration-300',
              'hover:!opacity-90',
              '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-blue-500',
            )
          }
        />

        <Dropdown
          label="Role"
          labelClassName="sr-only"
          options={roleOptions}
          selectedValues={[roleFilter]}
          onChange={(selected) =>
            setRoleFilter(
              (selected[0]?.value as UserRoleFilter) ??
                DEFAULT_USER_ROLE_FILTER,
            )
          }
          placeholder="All Roles"
          multiple={false}
          hasBorder={false}
          selectClassName={
            ' ' +
            clsx(
              '!flex !h-10 !min-w-[150px] !items-center !justify-between',
              '!whitespace-nowrap !rounded-xl !border !border-fieldBorder !bg-backgroundSec dark:!bg-neutral-0 !px-4 !py-0 !text-sm !font-medium !text-text dark:!text-neutral-800 !shadow-none !transition-colors !duration-300',
              'hover:!opacity-90',
              '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-blue-500',
            )
          }
        />
      </div>
    </div>
  );
}
