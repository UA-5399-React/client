import { describe, expect, it, vi } from 'vitest';

import { AUTH_ROLES, type AuthRole } from '@/constants';
import { ConfirmModalProvider } from '@/contexts/ConfirmModalProvider';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { render, screen, userEvent, within } from '@/utils/test-utils';

import { Sidebar } from './Sidebar';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

const defaultAuthMock = {
  logout: vi.fn(),
  isAuth: true,
  isAdmin: true,
  isSuperAdmin: false,
  isCustomer: false,
  canAccessAdminPanel: true,
  role: AUTH_ROLES.ADMIN as AuthRole | null,
};

const renderWithProviders = (ui: React.ReactElement) =>
  render(
    <ThemeProvider>
      <ConfirmModalProvider>{ui}</ConfirmModalProvider>
    </ThemeProvider>,
  );

describe('UI Component: Sidebar', () => {
  it('should render the sidebar', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);
    renderWithProviders(<Sidebar />);

    expect(screen.getByText('View Store')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should render super admin links for super_admin role', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      isSuperAdmin: true,
      canAccessAdminPanel: true,
      role: AUTH_ROLES.SUPER_ADMIN,
    });

    renderWithProviders(<Sidebar />);

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('View Store')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should link View Store to the client home page', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);

    renderWithProviders(<Sidebar />);

    expect(screen.getByRole('link', { name: 'View Store' })).toHaveAttribute(
      'href',
      '/',
    );
  });

  it('should call logout when the user confirms in the modal', async () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      canAccessAdminPanel: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    renderWithProviders(<Sidebar />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await user.click(logoutButton);

    const dialog = screen.getByRole('dialog');
    const confirmButton = within(dialog).getByRole('button', {
      name: /Logout/i,
    });
    await user.click(confirmButton);

    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
