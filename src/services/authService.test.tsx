import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  type Mock,
  vi,
} from 'vitest';

import { API_BASE_URL, AUTH_ENDPOINTS, AUTH_MESSAGES } from '@/constants';

import {
  type AuthApiError,
  authService,
  type ConfirmEmailResponse,
  type LoginPayload,
  type RegisterPayload,
} from './authService';

global.fetch = vi.fn();

describe('Service: authService', () => {
  const API_URL = API_BASE_URL;

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
      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.LOGIN}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockCredentials),
          credentials: 'include', // Critical for cookie functionality!
        },
      );

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
        AUTH_MESSAGES.INVALID_CREDENTIALS,
      );
    });

    it('should preserve backend error code for email confirmation errors', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Please confirm your email first',
          code: 'EMAIL_NOT_CONFIRMED',
        }),
      });

      await expect(authService.login(mockCredentials)).rejects.toMatchObject({
        message: 'Please confirm your email first',
        code: 'EMAIL_NOT_CONFIRMED',
      } satisfies Partial<AuthApiError>);
    });
  });

  describe('register()', () => {
    const mockPayload: RegisterPayload = {
      firstName: 'John',
      email: 'newuser@test.com',
      password: 'Password1!',
      passwordConfirmation: 'Password1!',
    };

    it('should send correct POST request and return data on success', async () => {
      const mockResponseData = {
        status: 'success',
        message: 'User created successfully.',
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await authService.register(mockPayload);

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.REGISTER}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mockPayload),
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw backend error message on failed registration', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Email already in use' }),
      });

      await expect(authService.register(mockPayload)).rejects.toThrow(
        'Email already in use',
      );
    });
  });

  describe('confirmEmail()', () => {
    const mockResponseData: ConfirmEmailResponse = {
      message: 'Email confirmed successfully',
    };

    it('should send correct POST request and return data on success', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await authService.confirmEmail('token-123');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.CONFIRM_EMAIL}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ token: 'token-123' }),
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw backend error message on failed confirmation', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({ message: 'Token expired' }),
      });

      await expect(authService.confirmEmail('token-123')).rejects.toThrow(
        'Token expired',
      );
    });
  });

  describe('resendConfirmation()', () => {
    it('should send correct POST request and return data on success', async () => {
      const mockResponseData = {
        message: 'Confirmation email sent.',
      };

      (global.fetch as Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponseData,
      });

      const result = await authService.resendConfirmation('test@example.com');

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.RESEND_CONFIRMATION}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email: 'test@example.com' }),
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockResponseData);
    });

    it('should throw backend error message on failed resend', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          message: 'Please wait before requesting another email',
        }),
      });

      await expect(
        authService.resendConfirmation('test@example.com'),
      ).rejects.toThrow('Please wait before requesting another email');
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

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.ME}`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if profile fetch fails (e.g., cookie expired)', async () => {
      (global.fetch as Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(authService.getMe()).rejects.toThrow(
        AUTH_MESSAGES.FETCH_PROFILE_FAILED,
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

      expect(global.fetch).toHaveBeenCalledWith(
        `${API_URL}${AUTH_ENDPOINTS.LOGOUT}`,
        {
          method: 'POST',
          credentials: 'include',
        },
      );
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
      expect(consoleSpy).toHaveBeenCalledWith(AUTH_MESSAGES.LOGOUT_FAILED);
    });
  });
});
