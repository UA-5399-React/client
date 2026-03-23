import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import {
  Pagination,
  UsersTable,
  UsersToolbar,
  UsersTopWidgets,
} from '@/components';
import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '@/constants/adminUsers';
import { useAdminUsers } from '@/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

const USERS_QUERY_PARAMS = {
  SEARCH: 'search',
  STATUS: 'status',
  ROLE: 'role',
  PAGE: 'page',
} as const;

const VALID_STATUS_FILTERS: UserStatusFilter[] = ['all', 'active', 'blocked'];

const VALID_ROLE_FILTERS: UserRoleFilter[] = [
  'all',
  'super_admin',
  'admin',
  'customer',
];

const isValidStatusFilter = (value: string | null): value is UserStatusFilter =>
  value !== null && VALID_STATUS_FILTERS.includes(value as UserStatusFilter);

const isValidRoleFilter = (value: string | null): value is UserRoleFilter =>
  value !== null && VALID_ROLE_FILTERS.includes(value as UserRoleFilter);

const getValidPage = (value: string | null) => {
  const page = Number(value);

  return Number.isInteger(page) && page > 0 ? page : 1;
};

export const AdminUsers = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchFromParams = searchParams.get(USERS_QUERY_PARAMS.SEARCH) ?? '';

  const statusFromParams = isValidStatusFilter(
    searchParams.get(USERS_QUERY_PARAMS.STATUS),
  )
    ? (searchParams.get(USERS_QUERY_PARAMS.STATUS) as UserStatusFilter)
    : DEFAULT_USER_STATUS_FILTER;

  const roleFromParams = isValidRoleFilter(
    searchParams.get(USERS_QUERY_PARAMS.ROLE),
  )
    ? (searchParams.get(USERS_QUERY_PARAMS.ROLE) as UserRoleFilter)
    : DEFAULT_USER_ROLE_FILTER;

  const currentPage = getValidPage(searchParams.get(USERS_QUERY_PARAMS.PAGE));

  const [searchValue, setSearchValue] = useState(searchFromParams);
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 500);

  useEffect(() => {
    setSearchValue(searchFromParams);
  }, [searchFromParams]);

  const updateSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        updater(next);
        return next;
      });
    },
    [setSearchParams],
  );

  useEffect(() => {
    const currentSearchParam =
      searchParams.get(USERS_QUERY_PARAMS.SEARCH) ?? '';

    if (debouncedSearch === currentSearchParam) {
      return;
    }

    updateSearchParams((next) => {
      if (debouncedSearch) {
        next.set(USERS_QUERY_PARAMS.SEARCH, debouncedSearch);
      } else {
        next.delete(USERS_QUERY_PARAMS.SEARCH);
      }

      next.set(USERS_QUERY_PARAMS.PAGE, '1');
    });
  }, [debouncedSearch, searchParams, updateSearchParams]);

  const handleStatusFilterChange = (value: UserStatusFilter) => {
    updateSearchParams((next) => {
      if (value === DEFAULT_USER_STATUS_FILTER) {
        next.delete(USERS_QUERY_PARAMS.STATUS);
      } else {
        next.set(USERS_QUERY_PARAMS.STATUS, value);
      }

      next.set(USERS_QUERY_PARAMS.PAGE, '1');
    });
  };

  const handleRoleFilterChange = (value: UserRoleFilter) => {
    updateSearchParams((next) => {
      if (value === DEFAULT_USER_ROLE_FILTER) {
        next.delete(USERS_QUERY_PARAMS.ROLE);
      } else {
        next.set(USERS_QUERY_PARAMS.ROLE, value);
      }

      next.set(USERS_QUERY_PARAMS.PAGE, '1');
    });
  };

  const handlePageChange = (page: number) => {
    updateSearchParams((next) => {
      next.set(USERS_QUERY_PARAMS.PAGE, String(page));
    });
  };

  const usersState = useAdminUsers({
    currentPage,
    search: debouncedSearch,
    statusFilter: statusFromParams,
    roleFilter: roleFromParams,
  });

  useEffect(() => {
    if (currentPage > usersState.totalPages) {
      updateSearchParams((next) => {
        next.set(USERS_QUERY_PARAMS.PAGE, '1');
      });
    }
  }, [currentPage, usersState.totalPages, updateSearchParams]);

  return (
    <section className="min-h-screen bg-[#FCFCFC] px-6 py-8">
      <div className="mx-auto">
        <UsersTopWidgets
          totalUsers={usersState.totalUsers}
          activeAdmins={usersState.activeAdmins}
          blockedUsers={usersState.blockedUsers}
        />

        <UsersToolbar
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          statusFilter={statusFromParams}
          setStatusFilter={handleStatusFilterChange}
          roleFilter={roleFromParams}
          setRoleFilter={handleRoleFilterChange}
          statusOptions={[...USER_STATUS_OPTIONS]}
          roleOptions={[...USER_ROLE_OPTIONS]}
        />

        <UsersTable
          items={usersState.paginatedUsers}
          onUpdateUser={usersState.handleUpdateUser}
        />

        <Pagination
          currentPage={currentPage}
          totalPages={usersState.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};
