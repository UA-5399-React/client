import { renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { AUTH_ROLES, MOCK_AUTH } from '@/constants';
import { authService } from '@/services/authService';

import { useRestoreAuthSession } from './useRestoreAuthSession';

vi.mock('@/services/authService', () => ({
  authService: {
    getMe: vi.fn(),
  },
}));

describe('useRestoreAuthSession', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  it('returns ready immediately when active auth data already exists', () => {
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'cookie-is-set');
    localStorage.setItem(
      MOCK_AUTH.EXPIRES_KEY,
      (Date.now() + 10_000).toString(),
    );
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.CUSTOMER);

    const { result } = renderHook(() => useRestoreAuthSession());

    expect(result.current).toBe(true);
    expect(authService.getMe).not.toHaveBeenCalled();
  });

  it('hydrates local auth state from server session cookies', async () => {
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: AUTH_ROLES.ADMIN,
    });

    const { result } = renderHook(() => useRestoreAuthSession());

    expect(result.current).toBe(false);

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBe('cookie-is-set');
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBe(AUTH_ROLES.ADMIN);
  });

  it('clears stale auth data when server session is not available', async () => {
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'stale-token');
    localStorage.setItem(
      MOCK_AUTH.EXPIRES_KEY,
      (Date.now() - 10_000).toString(),
    );
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.CUSTOMER);
    (authService.getMe as Mock).mockRejectedValueOnce(
      new Error('Unauthorized'),
    );

    const { result } = renderHook(() => useRestoreAuthSession());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.EXPIRES_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBeNull();
  });

  it('does not persist unsupported roles from the server response', async () => {
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: 'user',
    });

    const { result } = renderHook(() => useRestoreAuthSession());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });

    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBeNull();
  });
});
