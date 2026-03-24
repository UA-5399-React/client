import * as React from 'react';
import * as ApolloTesting from '@apollo/client/testing';
import { renderHook } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { ITEMS_PER_PAGE } from '@/constants';
import { mockUsers } from '@/constants/mockUsers';
import { GET_USERS_LIST } from '@/services/graphql/userAdminService';

import { useAdminUsers } from './useAdminUsers';

const testingModule = ApolloTesting as unknown as {
  MockedProvider: React.ComponentType<Record<string, unknown>>;
};
const MockedProvider = testingModule.MockedProvider;

const mocks = [
  {
    request: {
      query: GET_USERS_LIST,
    },
    result: {
      data: {
        users: {
          items: mockUsers,
          totalCount: mockUsers.length,
          __typename: 'UsersPage',
        },
      },
    },
  },
];

const wrapper = ({ children }: { children: React.ReactNode }) =>
  React.createElement(MockedProvider, { mocks, addTypename: false }, children);

describe('useAdminUsers', () => {
  it('returns correct widget values for the full users list', () => {
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: '',
          statusFilter: 'all',
          roleFilter: 'all',
        }),
      { wrapper },
    );

    const expectedTotalUsers = mockUsers.length;
    const expectedActiveAdmins = mockUsers.filter(
      (user) =>
        (user.role === 'admin' || user.role === 'super_admin') && user.isActive,
    ).length;
    const expectedBlockedUsers = mockUsers.filter(
      (user) => !user.isActive,
    ).length;
    const expectedFilteredCount = mockUsers.length;
    const expectedTotalPages = Math.max(
      1,
      Math.ceil(expectedFilteredCount / ITEMS_PER_PAGE),
    );

    expect(result.current.totalUsers).toBe(expectedTotalUsers);
    expect(result.current.activeAdmins).toBe(expectedActiveAdmins);
    expect(result.current.blockedUsers).toBe(expectedBlockedUsers);
    expect(result.current.filteredUsersCount).toBe(expectedFilteredCount);
    expect(result.current.totalPages).toBe(expectedTotalPages);
    expect(result.current.paginatedUsers).toEqual(
      mockUsers.slice(0, ITEMS_PER_PAGE),
    );
  });

  it('filters users by full name, ignoring case and extra spaces', () => {
    const targetUser = mockUsers[0];
    const searchValue = `  ${targetUser.firstName.toUpperCase()} ${targetUser.lastName.toUpperCase()}  `;

    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: searchValue,
          statusFilter: 'all',
          roleFilter: 'all',
        }),
      { wrapper },
    );

    const expectedUsers = mockUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      return fullName.includes(
        `${targetUser.firstName} ${targetUser.lastName}`.toLowerCase(),
      );
    });

    expect(result.current.filteredUsersCount).toBe(expectedUsers.length);
    expect(result.current.paginatedUsers).toEqual(expectedUsers);
  });

  it('filters users by email', () => {
    const targetUser = mockUsers[0];

    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: targetUser.email,
          statusFilter: 'all',
          roleFilter: 'all',
        }),
      { wrapper },
    );

    expect(result.current.filteredUsersCount).toBe(1);
    expect(result.current.paginatedUsers[0].email).toBe(targetUser.email);
  });

  it('filters users by active status', () => {
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: '',
          statusFilter: 'active',
          roleFilter: 'all',
        }),
      { wrapper },
    );

    const expectedUsers = mockUsers.filter((user) => user.isActive);

    expect(result.current.filteredUsersCount).toBe(expectedUsers.length);
    expect(result.current.paginatedUsers).toEqual(
      expectedUsers.slice(0, ITEMS_PER_PAGE),
    );
    expect(result.current.paginatedUsers.every((user) => user.isActive)).toBe(
      true,
    );
  });

  it('filters users by blocked status', () => {
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: '',
          statusFilter: 'blocked',
          roleFilter: 'all',
        }),
      { wrapper },
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
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: '',
          statusFilter: 'all',
          roleFilter: 'admin',
        }),
      { wrapper },
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
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: 'admin',
          statusFilter: 'active',
          roleFilter: 'super_admin',
        }),
      { wrapper },
    );

    const expectedUsers = mockUsers.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
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
    const { result } = renderHook(
      () =>
        useAdminUsers({
          currentPage: 1,
          search: 'user-that-does-not-exist',
          statusFilter: 'all',
          roleFilter: 'all',
        }),
      { wrapper },
    );

    expect(result.current.filteredUsersCount).toBe(0);
    expect(result.current.paginatedUsers).toEqual([]);
    expect(result.current.totalPages).toBe(1);
  });
});
