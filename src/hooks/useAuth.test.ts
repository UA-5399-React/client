import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { AUTH_ROLES, MOCK_AUTH } from '@/constants';
import { authService } from '@/services/authService';

import { useAuth } from './useAuth';

// 1. Mock the auth service
vi.mock('@/services/authService', () => ({
  authService: {
    logout: vi.fn(),
  },
}));

describe('Hook: useAuth', () => {
  beforeEach(() => {
    // Clear mocks and storage before each test
    vi.clearAllMocks();
    localStorage.clear();
  });

  // --- Block 1: Initialization (useState) ---

  it('should return unauthenticated state if localStorage is empty', () => {
    // Render the hook (it will immediately read the empty localStorage)
    const { result } = renderHook(() => useAuth());

    // result.current contains everything that the hook returned
    expect(result.current.isAuth).toBe(false);
    expect(result.current.role).toBeNull();
    expect(result.current.isAdmin).toBe(false);
  });

  it('should return unauthenticated state if token is expired', () => {
    const pastTime = (Date.now() - 10000).toString(); // Past time
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'expired-token');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, pastTime);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuth).toBe(false);
  });

  it('should return authenticated state as ADMIN if valid token and admin role exist', () => {
    const futureTime = (Date.now() + 10000).toString(); // Future time
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'valid-token');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, futureTime);
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuth).toBe(true);
    expect(result.current.role).toBe(AUTH_ROLES.ADMIN);
    expect(result.current.isAdmin).toBe(true);
  });

  it('should return authenticated state as USER if valid token and user role exist', () => {
    const futureTime = (Date.now() + 10000).toString();
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'valid-token');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, futureTime);
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, 'user'); // Standard role

    const { result } = renderHook(() => useAuth());

    expect(result.current.isAuth).toBe(true);
    expect(result.current.role).toBe('user');
    expect(result.current.isAdmin).toBe(false); // Check the flag
  });

  // --- Block 2: Asynchronous actions (Logout) ---

  it('should perform logout successfully: call API, clear storage, and update state', async () => {
    // 1. Set initial "logged in" state
    const futureTime = (Date.now() + 10000).toString();
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'valid-token');
    localStorage.setItem(MOCK_AUTH.EXPIRES_KEY, futureTime);
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);

    (authService.logout as Mock).mockResolvedValueOnce(true);

    const { result } = renderHook(() => useAuth());

    // Check that the hook started in the "authenticated" state
    expect(result.current.isAuth).toBe(true);

    // 2. Call the logout method inside act(), since it changes the state (setIsAuth)
    await act(async () => {
      await result.current.logout();
    });

    // 3. Check that the API was called
    expect(authService.logout).toHaveBeenCalledTimes(1);

    // 4. Check the finally block (localStorage should be clear)
    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.EXPIRES_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBeNull();

    // 5. State should change to false
    expect(result.current.isAuth).toBe(false);
  });

  it('should force local logout even if server API fails', async () => {
    // Hide console.error to not fill console with error messages during test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

    // Set initial data
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'valid-token');
    localStorage.setItem(
      MOCK_AUTH.EXPIRES_KEY,
      (Date.now() + 10000).toString(),
    );

    // Имитируем падение сервера при логауте
    (authService.logout as Mock).mockRejectedValueOnce(
      new Error('Server down'),
    );

    const { result } = renderHook(() => useAuth());

    await act(async () => {
      await result.current.logout();
    });

    // Error should be logged
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error during server logout:',
      expect.any(Error),
    );

    // MOST IMPORTANT: The finally block should have executed and cleared the data!
    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(result.current.isAuth).toBe(false);

    // Restore console.error
    consoleSpy.mockRestore();
  });
});
