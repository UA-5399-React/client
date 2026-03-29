import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ITEMS_PER_PAGE } from '@/constants';
import { mockUsers } from '@/constants/mockUsers';

import { useAdminUsers } from './useAdminUsers';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

describe('useAdminUsers', () => {
  const mockApolloResponse = (items = mockUsers) => {
    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: { users: { items, totalCount: items.length } },
      loading: false,
      error: undefined,
      refetch: vi.fn(),
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);
  };
  it('returns correct widget values for the full users list', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'all',
      }),
    );

    const expectedActiveAdmins = mockUsers.filter(
      (user) =>
        (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
    ).length;

    expect(result.current.totalUsers).toBe(mockUsers.length);
    expect(result.current.activeAdmins).toBe(expectedActiveAdmins);
    expect(result.current.paginatedUsers.length).toBeLessThanOrEqual(
      ITEMS_PER_PAGE,
    );
  });

  it('filters users by full name, ignoring case and extra spaces', () => {
    mockApolloResponse();
    const targetUser = mockUsers[0];
    const searchValue = `  ${(targetUser.firstName ?? '').toUpperCase()} ${(targetUser.lastName ?? '').toUpperCase()}  `;
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: searchValue,
        statusFilter: 'all',
        roleFilter: 'all',
      }),
    );

    expect(result.current.filteredUsersCount).toBeGreaterThan(0);
    expect(result.current.paginatedUsers[0].firstName).toBe(
      targetUser.firstName,
    );
  });

  it('filters users by email', () => {
    mockApolloResponse();
    const targetUser = mockUsers[0];

    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: targetUser.email,
        statusFilter: 'all',
        roleFilter: 'all',
      }),
    );

    expect(result.current.filteredUsersCount).toBe(1);
    expect(result.current.paginatedUsers[0].email).toBe(targetUser.email);
  });

  it('filters users by active status', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'active',
        roleFilter: 'all',
      }),
    );

    expect(result.current.paginatedUsers.every((user) => user.isActive)).toBe(
      true,
    );
  });

  it('filters users by blocked status', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'blocked',
        roleFilter: 'all',
      }),
    );

    const expectedUsers = mockUsers.filter((user) => !user.isActive);

    expect(result.current.filteredUsersCount).toBe(expectedUsers.length);
    expect(result.current.paginatedUsers).toEqual(
      expectedUsers.slice(0, ITEMS_PER_PAGE),
    );
    expect(result.current.paginatedUsers.every((user) => !user.isActive)).toBe(
      true,
    );
  });

  it('filters users by role', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: '',
        statusFilter: 'all',
        roleFilter: 'admin',
      }),
    );

    const expectedUsers = mockUsers.filter((user) => user.role === 'admin');

    expect(result.current.filteredUsersCount).toBe(expectedUsers.length);
    expect(result.current.paginatedUsers).toEqual(
      expectedUsers.slice(0, ITEMS_PER_PAGE),
    );
    expect(
      result.current.paginatedUsers.every((user) => user.role === 'admin'),
    ).toBe(true);
  });

  it('combines search, status and role filters together', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: 'admin',
        statusFilter: 'active',
        roleFilter: 'super_admin',
      }),
    );

    const expectedUsers = mockUsers.filter((user) => {
      const fullName = [user.firstName, user.lastName]
        .filter((value): value is string => Boolean(value?.trim()))
        .join(' ')
        .toLowerCase();
      const email = user.email.toLowerCase();

      const matchesSearch =
        fullName.includes('admin') || email.includes('admin');
      const matchesStatus = user.isActive;
      const matchesRole = user.role === 'super_admin';

      return matchesSearch && matchesStatus && matchesRole;
    });

    expect(result.current.filteredUsersCount).toBe(expectedUsers.length);
    expect(result.current.paginatedUsers).toEqual(expectedUsers);
  });

  it('returns empty paginatedUsers when no users match filters', () => {
    mockApolloResponse();
    const { result } = renderHook(() =>
      useAdminUsers({
        currentPage: 1,
        search: 'user-that-does-not-exist',
        statusFilter: 'all',
        roleFilter: 'all',
      }),
    );

    expect(result.current.filteredUsersCount).toBe(0);
    expect(result.current.paginatedUsers).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });
});
