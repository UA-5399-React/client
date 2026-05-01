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

const renderSidebar = (props = {}) => {
  const defaultProps = {
    isCollapsed: false,
    setIsCollapsed: vi.fn(),
    ...props,
  };

  return render(
    <ThemeProvider>
      <ConfirmModalProvider>
        <Sidebar {...defaultProps} />
      </ConfirmModalProvider>
    </ThemeProvider>,
  );
};

describe('UI Component: Sidebar', () => {
  it('should render the sidebar', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);
    renderSidebar({ isCollapsed: false });

    expect(screen.getByText('View Store')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Categories')).toBeInTheDocument();
    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.queryByText('Users')).not.toBeInTheDocument();
    expect(screen.queryByText('Settings')).not.toBeInTheDocument();
  });

  it('should not render labels when collapsed', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);
    renderSidebar({ isCollapsed: true });

    expect(screen.queryByText('Dashboard')).not.toBeInTheDocument();
    expect(screen.queryByText('Logout')).not.toBeInTheDocument();
  });

  it('should call setIsCollapsed when toggle button is clicked', async () => {
    const setIsCollapsed = vi.fn();
    const user = userEvent.setup();
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);

    renderSidebar({ isCollapsed: false, setIsCollapsed });

    const toggleButton = screen.getByRole('button', {
      name: /toggle sidebar/i,
    });
    await user.click(toggleButton);

    expect(setIsCollapsed).toHaveBeenCalled();
  });

  it('should render super admin links for super_admin role', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      isSuperAdmin: true,
      canAccessAdminPanel: true,
      role: AUTH_ROLES.SUPER_ADMIN,
    });

    renderSidebar({ isCollapsed: false });

    expect(screen.getByText('Users')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
    expect(screen.getByText('View Store')).toBeInTheDocument();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('should link View Store to the client home page', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);

    renderSidebar({ isCollapsed: false });

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
    renderSidebar({ isCollapsed: false });

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
