import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import {
  Pagination,
  UsersTable,
  UsersToolbar,
  UsersTopWidgets,
} from '@/components';
import { ROUTES } from '@/constants';
import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
  USER_ROLE_OPTIONS,
  USER_STATUS_OPTIONS,
} from '@/constants/adminUsers';
import { useAdminUsers } from '@/hooks';
import { useDebouncedValue } from '@/hooks/useDebouncedValue';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
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

export const AdminUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const {
    searchParams,
    currentPage,
    setPage,
    updateSearchParams,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam({
    paramName: USERS_QUERY_PARAMS.PAGE,
  });

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

  const [searchValue, setSearchValue] = useState(searchFromParams);
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 500);

  useEffect(() => {
    setSearchValue(searchFromParams);
  }, [searchFromParams]);

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

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
    setPage(page);
  };

  useEffect(() => {
    const locationState = location.state as
      | { successMessage?: string }
      | null
      | undefined;

    if (!locationState?.successMessage) {
      return;
    }

    setSuccessMessage(locationState.successMessage);
    navigate(
      {
        pathname: location.pathname,
        search: location.search,
      },
      { replace: true, state: null },
    );
  }, [location.pathname, location.search, location.state, navigate]);

  const usersState = useAdminUsers({
    currentPage,
    search: debouncedSearch,
    statusFilter: statusFromParams,
    roleFilter: roleFromParams,
  });

  useEffect(() => {
    normalizeOutOfRangePage(usersState.totalPages);
  }, [usersState.totalPages, normalizeOutOfRangePage]);

  return (
    <section className="bg-background text-text min-h-screen px-6 py-8 transition-colors duration-300">
      <div className="mx-auto">
        {successMessage && (
          <div className="mb-4 rounded-lg border border-[#b7ebcf] bg-[#ecfdf3] px-4 py-3 text-sm text-[#027a48]">
            {successMessage}
          </div>
        )}

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
          onCreateUser={() => navigate(ROUTES.ADMIN_USER_CREATE)}
        />

        <UsersTable items={usersState.paginatedUsers} />

        <Pagination
          currentPage={currentPage}
          totalPages={usersState.totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </section>
  );
};
