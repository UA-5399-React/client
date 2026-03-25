import { useMemo } from 'react';
import { useQuery } from '@apollo/client/react';

import { AUTH_ROLES, ITEMS_PER_PAGE } from '@/constants';
import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
} from '@/constants/adminUsers';
import { GET_USERS_LIST } from '@/services/graphql/userAdminService';
import type {
  AdminUser,
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

type UseAdminUsersParams = {
  currentPage: number;
  search: string;
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;
};

interface GetUsersListData {
  users: {
    items: AdminUser[];
    totalCount?: number;
  };
}

export const useAdminUsers = ({
  currentPage,
  search,
  statusFilter,
  roleFilter,
}: UseAdminUsersParams) => {
  const { data, loading, error } = useQuery<GetUsersListData>(GET_USERS_LIST, {
    fetchPolicy: 'cache-and-network',
  });

  const users = useMemo(() => data?.users?.items || [], [data]);

  const totalUsers = users.length;

  const activeAdmins = useMemo(
    () =>
      users.filter(
        (u) =>
          (u.role === AUTH_ROLES.ADMIN || u.role === AUTH_ROLES.SUPER_ADMIN) &&
          u.isActive,
      ).length,
    [users],
  );

  const blockedUsers = useMemo(
    () => users.filter((u) => !u.isActive).length,
    [users],
  );

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
        statusFilter === DEFAULT_USER_STATUS_FILTER ||
        (statusFilter === 'active' && user.isActive) ||
        (statusFilter === 'blocked' && !user.isActive);

      const matchesRole =
        roleFilter === DEFAULT_USER_ROLE_FILTER ||
        user.role.toLocaleLowerCase() === roleFilter.toLocaleLowerCase();

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

  return {
    totalUsers,
    activeAdmins,
    blockedUsers,
    totalPages,
    paginatedUsers,
    filteredUsersCount: filteredUsers.length,
    loading,
    error,
  };
};
