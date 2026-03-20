import { useMemo, useState } from 'react';

import { mockUsers } from '@/constants/mockUsers';

const ITEMS_PER_PAGE = 10;

export const useAdminUsers = () => {
  const [users, setUsers] = useState(mockUsers);
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All Roles');
  const [currentPage, setCurrentPage] = useState(1);

  const totalUsers = users.length;

  const activeAdmins = users.filter(
    (user) =>
      (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
  ).length;

  const blockedUsers = users.filter((user) => !user.isActive).length;

  const totalPages = Math.ceil(users.length / ITEMS_PER_PAGE) || 1;

  // TODO: implement filtering and search logic in a separate task
  // Currently pagination is applied to the full users list
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

  return {
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
  };
};
