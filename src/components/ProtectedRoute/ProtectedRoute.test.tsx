import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { render, screen } from '@/utils/test-utils';

import { ProtectedRoute } from './ProtectedRoute';

// 1. Mock the useAuth hook to control authentication state in tests
vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

// 2. Mock the React Router components to easily test their rendering by testid
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();

  return {
    ...actual,

    Navigate: vi.fn(({ to, replace }) => (
      <div
        data-testid="mock-navigate"
        data-to={to}
        data-replace={String(replace)}
      />
    )),
    Outlet: vi.fn(() => <div data-testid="mock-outlet">Outlet Component</div>),
  };
});

describe('Feature: ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Successful scenario
  it('should render <Outlet /> if user is authenticated AND is an admin', () => {
    // Set up the hook as if an admin has logged in
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: true,
      isSuperAdmin: false,
      role: 'admin',
    });

    render(<ProtectedRoute />);

    // Should see Outlet (child components of the router)
    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();

    // No redirect should occur
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  it('should redirect to SHOP if user is authenticated but NOT an admin', () => {
    // User is logged in but has customer role
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: false,
      isSuperAdmin: false,
      role: 'customer',
    });

    render(<ProtectedRoute />);

    // Outlet should not be rendered
    expect(screen.queryByTestId('mock-outlet')).not.toBeInTheDocument();

    // Should render Navigate with correct props (now to SHOP for authenticated)
    const navigateElement = screen.getByTestId('mock-navigate');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', ROUTES.SHOP);
    expect(navigateElement).toHaveAttribute('data-replace', 'true');
  });

  it('should render <Outlet /> if user is authenticated AND is a superadmin', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: false,
      isSuperAdmin: true,
      role: 'super_admin',
    });

    render(<ProtectedRoute />);

    expect(screen.getByTestId('mock-outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('mock-navigate')).not.toBeInTheDocument();
  });

  // Failure scenario 2: Not authenticated at all (guest)
  it('should redirect to login if user is NOT authenticated', () => {
    // Neither token nor role
    (useAuth as Mock).mockReturnValue({
      isAuth: false,
      isAdmin: false,
      isSuperAdmin: false,
      role: null,
    });

    render(<ProtectedRoute />);

    expect(screen.queryByTestId('mock-outlet')).not.toBeInTheDocument();

    const navigateElement = screen.getByTestId('mock-navigate');
    expect(navigateElement).toBeInTheDocument();
    expect(navigateElement).toHaveAttribute('data-to', ROUTES.LOGIN);
  });

  it('should redirect admin away from super_admin-only routes', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: true,
      isSuperAdmin: false,
      role: 'admin',
    });

    render(
      <ProtectedRoute
        allowedRoles={['super_admin']}
        redirectTo={ROUTES.ADMIN_PRODUCTS}
      />,
    );

    expect(screen.queryByTestId('mock-outlet')).not.toBeInTheDocument();

    const navigateElement = screen.getByTestId('mock-navigate');
    expect(navigateElement).toHaveAttribute('data-to', ROUTES.ADMIN_PRODUCTS);
  });
});
