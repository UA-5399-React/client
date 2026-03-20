import {
  Pagination,
  UsersTable,
  UsersToolbar,
  UsersTopWidgets,
} from '@/components';
import { useAdminUsers } from '@/hooks';

const statusOptions = [
  { label: 'All', value: 'All' },
  { label: 'Active', value: 'Active' },
  { label: 'Blocked', value: 'Blocked' },
];

const roleOptions = [
  { label: 'All Roles', value: 'All Roles' },
  { label: 'Super Admin', value: 'Super Admin' },
  { label: 'Admin', value: 'Admin' },
  { label: 'Customer', value: 'Customer' },
];

export const AdminUsers = () => {
  const {
    searchValue,
    setSearchValue,
    statusFilter,
    setStatusFilter,
    roleFilter,
    setRoleFilter,
    currentPage,
    setCurrentPage,
    totalUsers,
    activeAdmins,
    blockedUsers,
    totalPages,
    paginatedUsers,
    handleUpdateUser,
  } = useAdminUsers();

  return (
    <section className="min-h-screen bg-[#FCFCFC] px-6 py-8">
      <div className="mx-auto">
        <UsersTopWidgets
          totalUsers={totalUsers}
          activeAdmins={activeAdmins}
          blockedUsers={blockedUsers}
        />
        <UsersToolbar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          roleFilter={roleFilter}
          setRoleFilter={setRoleFilter}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
        />
        <UsersTable items={paginatedUsers} onUpdateUser={handleUpdateUser} />
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </section>
  );
};
