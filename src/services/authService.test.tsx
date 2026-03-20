import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import { API_BASE_URL } from '@/constants';

import { authService, type LoginPayload } from './authService';

global.fetch = vi.fn();

describe('Service: authService', () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http:/localhost:3000'; // The same default as in service

  beforeEach(() => {
    // Clear calls and mocks before each test to avoid interference
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Restore original functions (if we mocked console.error)
    vi.restoreAllMocks();
  });

  // --- Block 1: login ---
  describe('login()', () => {
    const mockCredentials: LoginPayload = {
      email: 'test@admin.com',
      password: 'password123',
    };

    it('should send correct POST request and return data on success', async () => {
      const mockResponseData = { id: '1', role: 'admin' };

      // Set up successful response from fetch
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await authService.login(mockCredentials);

      // Check that fetch was called with the correct arguments
      expect(global.fetch).toHaveBeenCalledTimes(1);
      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mockCredentials),
        credentials: 'include', // Critical for cookie functionality!
      });

      // Check that the service returned the parsed JSON
      expect(result).toEqual(mockResponseData);
    });

    it('should throw an error if the response is not ok (e.g., 401 Unauthorized)', async () => {
      // Imitate error from server
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      // Check that the service threw our custom error
      await expect(authService.login(mockCredentials)).rejects.toThrow(
        'Invalid email or password',
      );
    });
  });

  // --- Block 2: getMe ---
  describe('getMe()', () => {
    it('should send correct GET request and return user profile', async () => {
      const mockUser = { id: '1', email: 'test@admin.com', role: 'admin' };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      });

      const result = await authService.getMe();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/me`, {
        method: 'GET',
        credentials: 'include',
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if profile fetch fails (e.g., cookie expired)', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(authService.getMe()).rejects.toThrow(
        'Failed to fetch user profile',
      );
    });
  });

  // --- Block 3: logout ---
  describe('logout()', () => {
    it('should send correct POST request and return true on success', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
      });

      const result = await authService.logout();

      expect(global.fetch).toHaveBeenCalledWith(`${API_URL}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
      expect(result).toBe(true);
    });

    it('should return false and log an error if server logout fails', async () => {
      // Intercept console.error, for avoiding red errors in console
      const consoleSpy = vi
        .spyOn(console, 'error')
        .mockImplementation(() => {});

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      const result = await authService.logout();

      // The method should return false (response.ok === false)
      expect(result).toBe(false);

      // Ensure that the error was logged
      expect(consoleSpy).toHaveBeenCalledWith('Failed to logout on server');
    });
  });
});
