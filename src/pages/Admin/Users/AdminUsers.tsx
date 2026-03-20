import {
  Pagination,
  UsersTable,
  UsersToolbar,
  UsersTopWidgets,
} from '@/components';
import { useAdminUsers } from '@/hooks';

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

const roleOptions = [
  { label: 'All Roles', value: 'all' },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
];

export const AdminUsers = () => {
  const usersState = useAdminUsers();

  return (
    <section className="min-h-screen bg-[#FCFCFC] px-6 py-8">
      <div className="mx-auto">
        <UsersTopWidgets
          totalUsers={usersState.totalUsers}
          activeAdmins={usersState.activeAdmins}
          blockedUsers={usersState.blockedUsers}
        />
        <UsersToolbar
          searchValue={usersState.searchValue}
          setSearchValue={usersState.setSearchValue}
          statusFilter={usersState.statusFilter}
          setStatusFilter={usersState.setStatusFilter}
          roleFilter={usersState.roleFilter}
          setRoleFilter={usersState.setRoleFilter}
          statusOptions={statusOptions}
          roleOptions={roleOptions}
        />
        <UsersTable
          items={usersState.paginatedUsers}
          onUpdateUser={usersState.handleUpdateUser}
        />
        <Pagination
          currentPage={usersState.currentPage}
          totalPages={usersState.totalPages}
          onPageChange={usersState.setCurrentPage}
        />
      </div>
    </section>
  );
};
