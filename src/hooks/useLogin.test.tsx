import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { authService } from '@/services/authService';

import { useLogin } from './useLogin';

// 1. Mock the service that makes the real HTTP request
vi.mock('@/services/authService', () => ({
  authService: {
    login: vi.fn(),
  },
}));

describe('Hook: useLogin', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    vi.clearAllMocks();

    // 2. Create a clean QueryClient before each test!
    // Disable retry (retries), so tests with errors don't hang for 3 seconds
    queryClient = new QueryClient({
      defaultOptions: {
        mutations: {
          retry: false,
        },
      },
    });
  });

  // 3. Create a wrapper provider for our hook
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useLogin(), { wrapper });

    // Check initial states (before calling the mutation)
    expect(result.current.isIdle).toBe(true);
    expect(result.current.isPending).toBe(false);
    expect(result.current.isSuccess).toBe(false);
    expect(result.current.isError).toBe(false);
  });

  it('should successfully call authService.login and update state to success', async () => {
    const mockCredentials = {
      email: 'admin@test.com',
      password: 'password123',
    };
    const mockResponse = { accessToken: 'token-123' };

    // Imitate successful backend response
    (authService.login as Mock).mockResolvedValueOnce(mockResponse);

    const { result } = renderHook(() => useLogin(), { wrapper });

    // Call the mutation (mutate, not mutateAsync, to avoid wrapping in await act)
    result.current.mutate(mockCredentials);

    // Wait while the status changes to success
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    // Check that the service was called exactly once with the correct data
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(authService.login).toHaveBeenCalledWith(mockCredentials);

    // Check that the response data is stored in the mutation state
    expect(result.current.data).toEqual(mockResponse);
  });

  it('should transition to error state when authService.login fails', async () => {
    const mockCredentials = { email: 'wrong@test.com', password: 'bad' };
    const mockError = new Error('Invalid credentials');

    // Imitate error (401 Unauthorized, for example)
    (authService.login as Mock).mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useLogin(), { wrapper });

    result.current.mutate(mockCredentials);

    // Wait while the status changes to error
    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });

    // Check that the error was captured
    expect(authService.login).toHaveBeenCalledTimes(1);
    expect(result.current.error).toEqual(mockError);
    expect(result.current.isSuccess).toBe(false);
  });
});
