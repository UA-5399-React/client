import { useMemo, useState } from 'react';

import { ITEMS_PER_PAGE } from '@/constants';
import { mockUsers } from '@/constants/mockUsers';
import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

type UseAdminUsersParams = {
  currentPage: number;
  search: string;
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;
};

export const useAdminUsers = ({
  currentPage,
  search,
  statusFilter,
  roleFilter,
}: UseAdminUsersParams) => {
  const [users, setUsers] = useState(mockUsers);

  const totalUsers = users.length;

  const activeAdmins = users.filter(
    (user) =>
      (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
  ).length;

  const blockedUsers = users.filter((user) => !user.isActive).length;

  const normalizedSearch = search.trim().toLowerCase();

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const email = user.email.toLowerCase();

      const matchesSearch =
        !normalizedSearch ||
        fullName.includes(normalizedSearch) ||
        email.includes(normalizedSearch);

      const matchesStatus =
        statusFilter === 'all' ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'blocked' && !user.isActive);

      const matchesRole = roleFilter === 'all' || user.role === roleFilter;

      return matchesSearch && matchesStatus && matchesRole;
    });
  }, [users, normalizedSearch, statusFilter, roleFilter]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredUsers.slice(startIndex, endIndex);
  }, [currentPage, filteredUsers]);

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
    totalUsers,
    activeAdmins,
    blockedUsers,
    totalPages,
    paginatedUsers,
    filteredUsersCount: filteredUsers.length,
    handleUpdateUser,
  };
};
