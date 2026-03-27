import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { AUTH_ROLES, MOCK_AUTH, ROUTES } from '@/constants';
import { useLogin } from '@/hooks/useLogin';
import { authService } from '@/services/authService';
import { cartService } from '@/services/cartService';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { LoginForm } from './LoginForm';

// Mock dependencies
const mockNavigate = vi.fn();
let mockLocationState: Record<string, unknown> | null = null;

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => ({
      state: mockLocationState,
    }),
  };
});

vi.mock('@/hooks/useLogin', () => ({
  useLogin: vi.fn(),
}));

vi.mock('@/services/authService', () => ({
  authService: {
    getMe: vi.fn(),
  },
}));

vi.mock('@/services/cartService', () => ({
  cartService: {
    syncCart: vi.fn(),
  },
}));

vi.mock('@/store/useCartStore', () => ({
  useCartStore: {
    getState: vi.fn(() => ({
      items: [],
      setCart: vi.fn(),
    })),
  },
}));

describe('Feature: LoginForm', () => {
  const mockMutateAsync = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockLocationState = null;

    // Default mock implementation
    (useLogin as Mock).mockReturnValue({
      mutateAsync: mockMutateAsync,
      isPending: false,
    });
  });

  // 1. Basic Rendering
  it('should display all required form fields and submit button', () => {
    render(<LoginForm />);

    // Rule: find elements by placeholder or role
    expect(
      screen.getByPlaceholderText(/Your email address/i),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  // 2. Validation (Zod & React Hook Form)
  it('should show validation errors when submitted empty', async () => {
    const user = userEvent.setup(); // Emulate a real user

    render(<LoginForm />);

    const submitButton = screen.getByRole('button', { name: 'Sign In' });
    await user.click(submitButton);

    // Check that Zod validation kicks in and prevents API call
    expect(
      await screen.findByText('Username or email is required'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Password must be at least 6 characters'),
    ).toBeInTheDocument();
    expect(mockMutateAsync).not.toHaveBeenCalled();
  });

  // 3. Successful Authentication Flow (RBAC)
  it('should call login API, fetch user, and redirect to admin dashboard for admin role', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce(true);
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: AUTH_ROLES.ADMIN,
    });

    // Default cartService.syncCart mock
    vi.mocked(cartService.syncCart).mockResolvedValueOnce({
      items: [],
      total: 0,
      userId: 'user123',
    });

    render(<LoginForm />);

    // Fill the form
    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'admin@test.com',
    );
    await user.type(screen.getByPlaceholderText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    // Wait for the async flow to complete
    await waitFor(() => {
      // Check API calls
      expect(mockMutateAsync).toHaveBeenCalledWith({
        email: 'admin@test.com',
        password: 'password123',
      });
      expect(authService.getMe).toHaveBeenCalled();

      // Check LocalStorage updates
      expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBe('cookie-is-set');
      expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBe(AUTH_ROLES.ADMIN);

      // Check correct redirect to /admin base path
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN);
    });
  });

  it('should redirect to admin dashboard for super_admin role', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce(true);
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: AUTH_ROLES.SUPER_ADMIN,
    });
    vi.mocked(cartService.syncCart).mockResolvedValueOnce({
      items: [],
      total: 0,
      userId: 'user123',
    });

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'superadmin@test.com',
    );
    await user.type(screen.getByPlaceholderText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBe(
        AUTH_ROLES.SUPER_ADMIN,
      );
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN);
    });
  });

  it('should redirect to shop for a customer role', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockResolvedValueOnce(true);
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: AUTH_ROLES.CUSTOMER,
    });
    vi.mocked(cartService.syncCart).mockResolvedValueOnce({
      items: [],
      total: 0,
      userId: 'user123',
    });

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'customer@test.com',
    );
    await user.type(screen.getByPlaceholderText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBe(
        AUTH_ROLES.CUSTOMER,
      );
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SHOP);
    });
  });

  it('should redirect back to the original page after successful login when a from state exists', async () => {
    const user = userEvent.setup();
    mockLocationState = { from: ROUTES.CHECKOUT };
    mockMutateAsync.mockResolvedValueOnce(true);
    (authService.getMe as Mock).mockResolvedValueOnce({
      role: AUTH_ROLES.CUSTOMER,
    });

    render(<LoginForm />);

    await user.type(
      screen.getByPlaceholderText(/Your email address/i),
      'customer@test.com',
    );
    await user.type(screen.getByPlaceholderText(/Password/i), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES.CHECKOUT, {
        replace: true,
      });
    });
  });

  // 4. Error Handling and Server Feedback
  it('should display server error message on invalid credentials and clear it on typing', async () => {
    const user = userEvent.setup();
    mockMutateAsync.mockRejectedValueOnce(new Error('Unauthorized')); // Simulate server rejection

    render(<LoginForm />);

    const emailInput = screen.getByPlaceholderText(/Your email address/i);
    const passwordInput = screen.getByPlaceholderText(/Password/i);
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    // Try to login with bad data
    await user.type(emailInput, 'wrong@test.com');
    await user.type(passwordInput, 'wrongpass');
    await user.click(submitButton);

    // Check that the global error appeared
    const errorMessage = await screen.findByText(
      'Invalid email or password. Please try again.',
    );
    expect(errorMessage).toBeInTheDocument();

    // Emulate typing to clear the error (onChange hook)
    await user.type(emailInput, 'a');

    // Wait for the error to be removed from the DOM
    await waitFor(() => {
      expect(
        screen.queryByText('Invalid email or password. Please try again.'),
      ).not.toBeInTheDocument();
    });
  });

  // 5. Session Management (useEffect auto-redirect)
  it('should auto-redirect to admin if a valid admin session exists in localStorage', () => {
    // Setup a valid mock session
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'valid-token');
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);
    localStorage.setItem(
      MOCK_AUTH.EXPIRES_KEY,
      (Date.now() + 10000).toString(),
    ); // Expires in the future

    render(<LoginForm />);

    // Expect the useEffect to immediately redirect to /admin base path
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN);
  });

  it('should clear auth data if session is expired', () => {
    // Setup an expired session
    localStorage.setItem(MOCK_AUTH.TOKEN_KEY, 'expired-token');
    localStorage.setItem(MOCK_AUTH.ROLE_KEY, AUTH_ROLES.ADMIN);
    localStorage.setItem(
      MOCK_AUTH.EXPIRES_KEY,
      (Date.now() - 10000).toString(),
    ); // Expired in the past

    render(<LoginForm />);

    // Expect cleanup logic to run
    expect(localStorage.getItem(MOCK_AUTH.TOKEN_KEY)).toBeNull();
    expect(localStorage.getItem(MOCK_AUTH.ROLE_KEY)).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
