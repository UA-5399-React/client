import * as ApolloClient from '@apollo/client/react';
import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET_USER } from '@/services/graphql/userAdminService';

import { useGetAdminUser } from './useGetAdminUser';

vi.mock('@apollo/client/react', () => ({
  useQuery: vi.fn(),
}));

describe('useGetAdminUser', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns user data when id is provided', () => {
    const user = {
      id: 'user-1',
      firstName: 'Jane',
      lastName: 'Doe',
      email: 'jane@example.com',
      role: 'ADMIN',
      isActive: true,
      isEmailConfirmed: true,
      createdAt: '2026-03-20T10:00:00.000Z',
      updatedAt: '2026-03-20T10:00:00.000Z',
    };

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: { user },
      loading: false,
      error: undefined,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useGetAdminUser('user-1'));

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_USER, {
      variables: { id: 'user-1' },
      skip: false,
      fetchPolicy: 'cache-and-network',
    });
    expect(result.current.user).toEqual(user);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('skips the query when id is missing and exposes undefined user', () => {
    const queryError = new Error('Missing id');

    vi.mocked(ApolloClient.useQuery).mockReturnValue({
      data: undefined,
      loading: false,
      error: queryError,
    } as unknown as ReturnType<typeof ApolloClient.useQuery>);

    const { result } = renderHook(() => useGetAdminUser());

    expect(ApolloClient.useQuery).toHaveBeenCalledWith(GET_USER, {
      variables: { id: undefined },
      skip: true,
      fetchPolicy: 'cache-and-network',
    });
    expect(result.current.user).toBeUndefined();
    expect(result.current.error).toBe(queryError);
  });
});
