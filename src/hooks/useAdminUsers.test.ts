import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ITEMS_PER_PAGE } from '@/constants';
import {
  DEFAULT_USER_ROLE_FILTER,
  DEFAULT_USER_STATUS_FILTER,
} from '@/constants/adminUsers';
import { mockUsers } from '@/constants/mockUsers';
import { GET_USERS_LIST } from '@/services/graphql/userAdminService';
import type { AdminUser } from '@/types/admin-user.types';
import type {
  UserRoleFilter,
  UserStatusFilter,
} from '@/types/admin-user.types';

import { useAdminUsers } from './useAdminUsers';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

const applyClientFilters = (
  items: AdminUser[],
  {
    search = '',
    statusFilter = DEFAULT_USER_STATUS_FILTER,
    roleFilter = DEFAULT_USER_ROLE_FILTER,
  }: {
    search?: string;
    statusFilter?: UserStatusFilter;
    roleFilter?: UserRoleFilter;
  } = {},
) => {
  const normalizedSearch = search.trim().toLowerCase();

  return items.filter((user) => {
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
};

describe('useAdminUsers', () => {
  const mockApolloResponse = ({
    items = mockUsers,
    total = items.length,
    loading = false,
  }: {
    items?: AdminUser[];
    total?: number;
    loading?: boolean;
  } = {}) => {
    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: { users: { items, total } },
      loading,
      error: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('calls useQuery with server pagination variables', () => {
    mockApolloResponse();

    renderHook(() =>
      useAdminUsers({
        currentPage: 2,
        search: '  john  ',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(
      GET_USERS_LIST,
      expect.objectContaining({
        variables: {
          page: 2,
          limit: ITEMS_PER_PAGE,
          search: 'john',
        },
        fetchPolicy: 'cache-and-network',
        notifyOnNetworkStatusChange: true,
      }),
    );
  });

  it('passes null search when search is empty', () => {
    mockApolloResponse();

    renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '   ',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(
      GET_USERS_LIST,
      expect.objectContaining({
        variables: expect.objectContaining({ search: null }),
      }),
    );
  });

  it('returns totalUsers and totalPages from server total', () => {
    mockApolloResponse({
      items: mockUsers.slice(0, ITEMS_PER_PAGE),
      total: 25,
    });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.totalUsers).toBe(25);
    expect(result.current.totalPages).toBe(3);
  });

  it('returns current page items without client slice on page 2', () => {
    const page2Items = mockUsers.slice(3, 6);

    mockApolloResponse({ items: page2Items, total: 25 });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 2,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.paginatedUsers).toEqual(page2Items);
    expect(result.current.paginatedUsers.length).toBe(3);
  });

  it('exposes queryVariables matching the useQuery variables', () => {
    mockApolloResponse();

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: 'test',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.queryVariables).toEqual({
      page: 1,
      limit: ITEMS_PER_PAGE,
      search: 'test',
    });
  });

  it('returns widget counts for the current page only', () => {
    const pageItems = mockUsers.slice(0, ITEMS_PER_PAGE);
    mockApolloResponse({ items: pageItems, total: mockUsers.length });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    const expectedActiveAdmins = pageItems.filter(
      (user) =>
        (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
    ).length;

    const expectedBlocked = pageItems.filter((user) => !user.isActive).length;

    expect(result.current.activeAdmins).toBe(expectedActiveAdmins);
    expect(result.current.blockedUsers).toBe(expectedBlocked);
  });

  it('filters users by full name on the current page', () => {
    const targetUser = mockUsers[0];
    const searchValue = `  ${(targetUser.firstName ?? '').toUpperCase()} ${(targetUser.lastName ?? '').toUpperCase()}  `;

    mockApolloResponse({ items: [targetUser], total: 1 });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: searchValue,
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.filteredUsersCount).toBe(1);
    expect(result.current.paginatedUsers[0].firstName).toBe(
      targetUser.firstName,
    );
  });

  it('filters users by email on the current page', () => {
    const targetUser = mockUsers[0];

    mockApolloResponse({ items: [targetUser], total: 1 });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: targetUser.email,
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.filteredUsersCount).toBe(1);
    expect(result.current.paginatedUsers[0].email).toBe(targetUser.email);
  });

  it('filters users by active status on the current page', () => {
    mockApolloResponse();

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'active',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    const expected = applyClientFilters(mockUsers, { statusFilter: 'active' });

    expect(result.current.paginatedUsers).toEqual(expected);
    expect(result.current.paginatedUsers.every((user) => user.isActive)).toBe(
      true,
    );
  });

  it('filters users by blocked status on the current page', () => {
    mockApolloResponse();

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'blocked',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    const expected = applyClientFilters(mockUsers, { statusFilter: 'blocked' });

    expect(result.current.filteredUsersCount).toBe(expected.length);
    expect(result.current.paginatedUsers).toEqual(expected);
    expect(result.current.paginatedUsers.every((user) => !user.isActive)).toBe(
      true,
    );
  });

  it('filters users by role on the current page', () => {
    mockApolloResponse();

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'admin',
        lastLoginSort: null,
      }),
    );

    const expected = applyClientFilters(mockUsers, { roleFilter: 'admin' });

    expect(result.current.filteredUsersCount).toBe(expected.length);
    expect(result.current.paginatedUsers).toEqual(expected);
    expect(
      result.current.paginatedUsers.every((user) => user.role === 'admin'),
    ).toBe(true);
  });

  it('combines search, status and role filters on the current page', () => {
    mockApolloResponse();

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: 'admin',
        statusFilter: 'active',
        roleFilter: 'super_admin',
        lastLoginSort: null,
      }),
    );

    const expected = applyClientFilters(mockUsers, {
      search: 'admin',
      statusFilter: 'active',
      roleFilter: 'super_admin',
    });

    expect(result.current.filteredUsersCount).toBe(expected.length);
    expect(result.current.paginatedUsers).toEqual(expected);
  });

  it('sorts users by last login on the current page', () => {
    const usersWithLogin: AdminUser[] = [
      { ...mockUsers[0], lastLoginAt: '2026-03-10T00:00:00.000Z' },
      { ...mockUsers[1], lastLoginAt: '2026-03-20T00:00:00.000Z' },
      { ...mockUsers[2], lastLoginAt: undefined },
    ];

    mockApolloResponse({ items: usersWithLogin, total: usersWithLogin.length });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: 'asc',
      }),
    );

    expect(result.current.paginatedUsers.map((u) => u.id)).toEqual([
      mockUsers[2].id,
      mockUsers[0].id,
      mockUsers[1].id,
    ]);
  });

  it('returns empty paginatedUsers when server returns no items', () => {
    mockApolloResponse({ items: [], total: 0 });

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: 'user-that-does-not-exist',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.filteredUsersCount).toBe(0);
    expect(result.current.paginatedUsers).toEqual([]);
    expect(result.current.totalPages).toBe(1);
    expect(result.current.totalUsers).toBe(0);
  });

  it('exposes loading and error from useQuery', () => {
    const apolloError = new Error('Network error');

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: true,
      error: apolloError,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
        lastLoginSort: null,
      }),
    );

    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
