import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { AdminLogin } from './AdminLogin';

// Mock useNavigate so we can assert redirects without actually navigating
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('Page: AdminLogin', () => {
  beforeEach(() => {
    localStorage.clear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    localStorage.clear();
  });

  // ─── Layout ─────────────────────────────────────────────────────────────────

  it('should render the duck logo image', () => {
    render(<AdminLogin />);
    const logo = screen.getByAltText('TechnoWorld STORE Logo');
    expect(logo).toBeInTheDocument();
  });

  it('should render the Sign In heading', () => {
    render(<AdminLogin />);
    expect(
      screen.getByRole('heading', { name: 'Sign In' }),
    ).toBeInTheDocument();
  });

  it('should render the username/email and password fields', () => {
    render(<AdminLogin />);
    expect(
      screen.getByPlaceholderText('Your username or email address'),
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
  });

  it('should render the Sign In button', () => {
    render(<AdminLogin />);
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should render the "Remember me" checkbox', () => {
    render(<AdminLogin />);
    expect(
      screen.getByRole('checkbox', { name: /remember me/i }),
    ).toBeInTheDocument();
  });

  it('should render "Forgot password?" link', () => {
    render(<AdminLogin />);
    expect(
      screen.getByRole('link', { name: /forgot password/i }),
    ).toBeInTheDocument();
  });

  it('should render "Sign Up" link', () => {
    render(<AdminLogin />);
    expect(screen.getByRole('link', { name: /sign up/i })).toBeInTheDocument();
  });

  // ─── Validation ──────────────────────────────────────────────────────────────

  it('should show required error when submitting empty form', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(
      await screen.findByText('Username or email is required'),
    ).toBeInTheDocument();
    expect(
      await screen.findByText('Password must be at least 6 characters'),
    ).toBeInTheDocument();
  });

  it('should show password error when password is too short', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    await user.type(
      screen.getByPlaceholderText('Your username or email address'),
      'someuser',
    );
    await user.type(screen.getByPlaceholderText('Password'), '123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(
      await screen.findByText('Password must be at least 6 characters'),
    ).toBeInTheDocument();
  });

  // ─── Authentication ──────────────────────────────────────────────────────────

  it('should redirect admin to /admin/products on valid admin credentials', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    await user.type(
      screen.getByPlaceholderText('Your username or email address'),
      'admin@gmail.com',
    );
    await user.type(screen.getByPlaceholderText('Password'), 'admin123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
  });

  it('should redirect regular user to / on valid non-admin credentials', async () => {
    const user = userEvent.setup();
    render(<AdminLogin />);

    await user.type(
      screen.getByPlaceholderText('Your username or email address'),
      'user@example.com',
    );
    await user.type(screen.getByPlaceholderText('Password'), 'password123');
    await user.click(screen.getByRole('button', { name: 'Sign In' }));

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should redirect already-authenticated admin on mount', () => {
    const futureExpiry = (Date.now() + 60 * 60 * 1000).toString();
    localStorage.setItem('token', 'mock-jwt-token');
    localStorage.setItem('token_expires', futureExpiry);
    localStorage.setItem('role', 'admin');

    render(<AdminLogin />);

    expect(mockNavigate).toHaveBeenCalledWith('/admin/products');
  });

  it('should redirect already-authenticated user on mount', () => {
    const futureExpiry = (Date.now() + 60 * 60 * 1000).toString();
    localStorage.setItem('token', 'mock-user-token');
    localStorage.setItem('token_expires', futureExpiry);
    localStorage.setItem('role', 'user');

    render(<AdminLogin />);

    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  it('should clear expired token on mount', () => {
    const pastExpiry = (Date.now() - 1000).toString();
    localStorage.setItem('token', 'old-token');
    localStorage.setItem('token_expires', pastExpiry);
    localStorage.setItem('role', 'admin');

    render(<AdminLogin />);

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('token_expires')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
    // No redirect for expired tokens
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
