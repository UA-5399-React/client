import * as ApolloClient from '@apollo/client/react';
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { GET_USERS_LIST } from '@/services/graphql/userAdminService';

import { useCreateAdminUser } from './useCreateAdminUser';

vi.mock('@apollo/client/react', () => ({
  useMutation: vi.fn(),
}));

describe('useCreateAdminUser', () => {
  const createUserMutationMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('configures the mutation and exposes successful create user data', async () => {
    const payload = {
      user: {
        id: 'user-1',
        email: 'john@example.com',
      },
      tempPassword: 'TempPass123',
    };

    createUserMutationMock.mockResolvedValueOnce({
      data: { createUser: payload },
    });

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createUserMutationMock,
      {
        data: { createUser: payload },
        loading: false,
        error: undefined,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useCreateAdminUser());

    expect(ApolloClient.useMutation).toHaveBeenCalledWith(expect.anything(), {
      refetchQueries: [{ query: GET_USERS_LIST }],
    });

    await act(async () => {
      const response = await result.current.createUser({
        email: 'john@example.com',
        password: 'password123',
        role: 'ADMIN',
        firstName: 'John',
        lastName: 'Doe',
      });

      expect(response).toEqual(payload);
    });

    expect(createUserMutationMock).toHaveBeenCalledWith({
      variables: {
        input: {
          email: 'john@example.com',
          password: 'password123',
          role: 'ADMIN',
          firstName: 'John',
          lastName: 'Doe',
        },
      },
    });
    expect(result.current.data).toEqual(payload);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBeUndefined();
  });

  it('returns null when the mutation resolves without data', async () => {
    createUserMutationMock.mockResolvedValueOnce({ data: undefined });

    const apolloError = new Error('Create failed');

    vi.mocked(ApolloClient.useMutation).mockReturnValue([
      createUserMutationMock,
      {
        data: undefined,
        loading: true,
        error: apolloError,
      },
    ] as unknown as ReturnType<typeof ApolloClient.useMutation>);

    const { result } = renderHook(() => useCreateAdminUser());

    await act(async () => {
      const response = await result.current.createUser({
        email: 'jane@example.com',
        role: 'CUSTOMER',
      });

      expect(response).toBeNull();
    });

    expect(result.current.data).toBeUndefined();
    expect(result.current.loading).toBe(true);
    expect(result.current.error).toBe(apolloError);
  });
});
