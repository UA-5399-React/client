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
  UserLastLoginSortOrder,
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

type UseAdminUsersParams = {
  currentPage: number;
  search: string;
  statusFilter: UserStatusFilter;
  roleFilter: UserRoleFilter;
  lastLoginSort: UserLastLoginSortOrder | null;
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
  lastLoginSort,
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
          (u.role.toLowerCase() === AUTH_ROLES.ADMIN.toLowerCase() ||
            u.role.toLowerCase() === AUTH_ROLES.SUPER_ADMIN.toLowerCase()) &&
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
      const fullName = [user.firstName, user.lastName]
        .filter((value): value is string => Boolean(value?.trim()))
        .join(' ')
        .toLowerCase();
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

  const sortedUsers = useMemo(() => {
    if (!lastLoginSort) return filteredUsers;

    return [...filteredUsers].sort((a, b) => {
      const aTime = a.lastLoginAt
        ? new Date(a.lastLoginAt).getTime()
        : -Infinity;
      const bTime = b.lastLoginAt
        ? new Date(b.lastLoginAt).getTime()
        : -Infinity;

      return lastLoginSort === 'asc' ? aTime - bTime : bTime - aTime;
    });
  }, [filteredUsers, lastLoginSort]);

  const totalPages = Math.max(
    1,
    Math.ceil(sortedUsers.length / ITEMS_PER_PAGE),
  );

  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;

    return sortedUsers.slice(startIndex, endIndex);
  }, [currentPage, sortedUsers]);

  return {
    totalUsers,
    activeAdmins,
    blockedUsers,
    totalPages,
    paginatedUsers,
    filteredUsersCount: sortedUsers.length,
    loading,
    error,
  };
};
