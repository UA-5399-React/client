import { useMemo, useState } from 'react';

import {
  Pagination,
  UsersTable,
  UsersToolbar,
  UsersTopWidgets,
} from '@/components';
import { mockUsers } from '@/constants/mockUsers';

const ITEMS_PER_PAGE = 10;

const statusOptions = [
  { label: 'All', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Blocked', value: 'blocked' },
];

const roleOptions = [
  { label: 'All Role', value: 'all' },
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Customer', value: 'customer' },
];

export const AdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const totalUsers = users.length;

  const activeAdmins = users.filter(
    (user) =>
      (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
  ).length;

  const blockedUsers = users.filter((user) => !user.isActive).length;

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE);

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return users.slice(startIndex, endIndex);
  }, [currentPage, users]);

  const handleUpdateUser = (
    userId: string,
    field: 'role' | 'isActive',
    newValue: string | boolean,
  ) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, [field]: newValue } : user,
      ),
    );
  };

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

        <div className="mx-5 mt-6 flex justify-center">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
    </section>
  );
};
