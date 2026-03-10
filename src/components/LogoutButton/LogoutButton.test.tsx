import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { ROUTES } from '../../constants';
import { LogoutButton } from './LogoutButton';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

describe('UI Component: LogoutButton', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
    localStorage.clear();
  });

  it('should render the logout button', () => {
    render(<LogoutButton />);
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument();
  });

  it('should have correct styling classes', () => {
    render(<LogoutButton />);
    const button = screen.getByRole('button', { name: /logout/i });
    expect(button).toHaveClass('bg-red-500', 'text-white', 'rounded');
  });

  it('should remove token from localStorage on click', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'abc123');

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('token')).toBeNull();
  });

  it('should remove token_expires from localStorage on click', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token_expires', '9999999');

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('token_expires')).toBeNull();
  });

  it('should remove role from localStorage on click', async () => {
    const user = userEvent.setup();
    localStorage.setItem('role', 'admin');

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('role')).toBeNull();
  });

  it('should clear all auth keys at once', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'abc123');
    localStorage.setItem('token_expires', '9999999');
    localStorage.setItem('role', 'admin');

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('token_expires')).toBeNull();
    expect(localStorage.getItem('role')).toBeNull();
  });

  it('should navigate to the login page after logout', async () => {
    const user = userEvent.setup();

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(mockNavigate).toHaveBeenCalledTimes(1);
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_LOGIN);
  });

  it('should navigate only after clearing localStorage', async () => {
    const user = userEvent.setup();
    localStorage.setItem('token', 'abc123');

    const callOrder: string[] = [];
    vi.spyOn(Storage.prototype, 'removeItem').mockImplementation((key) => {
      callOrder.push(`remove:${key}`);
    });
    mockNavigate.mockImplementation(() => {
      callOrder.push('navigate');
    });

    render(<LogoutButton />);
    await user.click(screen.getByRole('button', { name: /logout/i }));

    expect(callOrder.indexOf('navigate')).toBeGreaterThan(
      callOrder.indexOf('remove:token'),
    );

    vi.restoreAllMocks();
  });
});
