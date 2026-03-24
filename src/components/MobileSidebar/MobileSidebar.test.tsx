import { beforeEach, describe, expect, it, vi } from 'vitest';

import { AUTH_ROLES, type AuthRole, ROUTES } from '@/constants';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { render, screen, userEvent } from '@/utils/test-utils';

import { MobileSidebar } from './MobileSidebar';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

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
  isAdmin: true,
  isSuperAdmin: false,
  isCustomer: false,
  canAccessAdminPanel: true,
  isAuth: true,
  role: AUTH_ROLES.ADMIN as AuthRole | null,
};

const defaultProps = {
  isSidebarOpen: false,
  onSidebarChange: vi.fn(),
};

const renderWithTheme = (
  props: {
    isSidebarOpen: boolean;
    onSidebarChange: (open: boolean) => void;
  } = defaultProps,
) =>
  render(
    <ThemeProvider>
      <MobileSidebar {...props} />
    </ThemeProvider>,
  );

describe('UI Component: MobileSidebar', () => {
  beforeEach(() => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);
    mockNavigate.mockClear();
    defaultProps.onSidebarChange.mockClear();
  });

  it('should render header with Admin title and menu icon when sidebar is closed', () => {
    renderWithTheme();

    expect(screen.getByText('Admin')).toBeInTheDocument();
    const menuIcon = screen.getByText('Admin').previousElementSibling;
    expect(menuIcon).toBeInTheDocument();
  });

  it('should call onSidebarChange when menu icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme();

    await user.click(screen.getByText('Admin').previousElementSibling!);

    expect(defaultProps.onSidebarChange).toHaveBeenCalledWith(true);
  });

  it('should show overlay with nav links and logout when isSidebarOpen is true', () => {
    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    expect(screen.getByText('ADMIN')).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Categories' }),
    ).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Products' })).toBeInTheDocument();
    expect(
      screen.queryByRole('link', { name: 'Settings' }),
    ).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  it('should not show overlay when isSidebarOpen is false', () => {
    renderWithTheme();

    expect(
      screen.queryByRole('link', { name: 'Products' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /Logout/i }),
    ).not.toBeInTheDocument();
  });

  it('should call onSidebarChange(false) when close icon is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    const closeIcon = screen.getByText('ADMIN').previousElementSibling;
    expect(closeIcon).toBeInTheDocument();
    await user.click(closeIcon!);

    expect(defaultProps.onSidebarChange).toHaveBeenCalledWith(false);
  });

  it('should call onSidebarChange(false) when nav link is clicked', async () => {
    const user = userEvent.setup();
    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    await user.click(screen.getByRole('link', { name: 'Products' }));

    expect(defaultProps.onSidebarChange).toHaveBeenCalledWith(false);
  });

  it('should call logout and navigate to login when Logout button is clicked', async () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      canAccessAdminPanel: true,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    await user.click(screen.getByRole('button', { name: /Logout/i }));

    expect(mockLogout).toHaveBeenCalledOnce();
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('should render Products and Categories links with correct hrefs for admin', () => {
    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    const categoriesLink = screen.getByRole('link', { name: 'Categories' });
    const productsLink = screen.getByRole('link', { name: 'Products' });

    expect(categoriesLink).toHaveAttribute('href', ROUTES.ADMIN_CATEGORIES);
    expect(productsLink).toHaveAttribute('href', ROUTES.ADMIN_PRODUCTS);
  });

  it('should render super admin links when role is super_admin', () => {
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      isSuperAdmin: true,
      canAccessAdminPanel: true,
      role: AUTH_ROLES.SUPER_ADMIN,
    });

    renderWithTheme({ ...defaultProps, isSidebarOpen: true });

    expect(screen.getByRole('link', { name: 'Settings' })).toHaveAttribute(
      'href',
      ROUTES.ADMIN_SETTING,
    );
  });
});
