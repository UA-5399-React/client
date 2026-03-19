import clsx from 'clsx';
import { UserPlus } from 'lucide-react';

import { Button, Dropdown, SearchInput } from '@/components';

type FilterOption = {
  label: string;
  value: string;
};

interface UsersToolbarProps {
  searchValue: string;
  setSearchValue: (value: string) => void;

  statusFilter: string;
  setStatusFilter: (value: string) => void;

  roleFilter: string;
  setRoleFilter: (value: string) => void;

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
  const getStatusDisplayValue = (val: string) => {
    if (val === 'all') return 'All';
    const option = statusOptions.find((opt) => opt.value === val);
    return option ? option.label : 'All';
  };

  const getRoleDisplayValue = (val: string) => {
    if (val === 'all') return 'All Role';
    const option = roleOptions.find((opt) => opt.value === val);
    return option ? option.label : 'All Role';
  };

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
          className="flex h-[48px] items-center gap-2 rounded-xl bg-[#1D4ED8] px-6 text-sm font-medium text-white hover:bg-[#1E40AF]"
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
          selectedValues={[getStatusDisplayValue(statusFilter)]}
          onChange={(selected) => setStatusFilter(selected[0]?.value ?? 'all')}
          placeholder="All"
          multiple={false}
          hasBorder={false}
          selectClassName={
            ' ' +
            clsx(
              '!flex !items-center !justify-between',
              '!h-10 !min-w-[100px] !rounded-xl !bg-[#F3F4F6] !px-4 !py-0 !text-sm !font-medium !text-[#1F2937] !shadow-none hover:!bg-[#E5E7EB]',
              '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-[#2563EB]',
            )
          }
        />

        <Dropdown
          label="Role"
          labelClassName="sr-only"
          options={roleOptions}
          selectedValues={[getRoleDisplayValue(roleFilter)]}
          onChange={(selected) => setRoleFilter(selected[0]?.value ?? 'all')}
          placeholder="All Role"
          multiple={false}
          hasBorder={false}
          selectClassName={
            ' ' +
            clsx(
              '!flex !items-center !justify-between',
              '!h-10 !min-w-[120px] !rounded-xl !bg-[#F3F4F6] !px-4 !py-0 !text-sm !font-medium !text-[#1F2937] !shadow-none hover:!bg-[#E5E7EB]',
              '[&_svg]:!h-4 [&_svg]:!w-4 [&_svg]:!text-[#2563EB]',
            )
          }
        />
      </div>
    </div>
  );
}
