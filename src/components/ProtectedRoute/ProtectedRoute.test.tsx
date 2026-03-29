import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AUTH_ROLES, ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

import { ProtectedRoute } from './ProtectedRoute';

vi.mock('@/hooks/useAuth');

type UseAuthReturn = ReturnType<typeof useAuth>;

const createUseAuthMock = (
  overrides: Partial<UseAuthReturn> = {},
): UseAuthReturn => ({
  isAuth: false,
  role: null,
  isAdmin: false,
  isSuperAdmin: false,
  isCustomer: false,
  canAccessAdminPanel: false,
  logout: vi.fn(async () => {}),
  ...overrides,
});

describe('ProtectedRoute', () => {
  it('redirects to login if user is not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: false,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>
          <Route path={ROUTES.LOGIN} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('preserves the original destination when redirecting to login', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: false,
      }),
    );

    const LoginPage = () => {
      const location = useLocation();
      return <div>{(location.state as { from?: string } | null)?.from}</div>;
    };

    render(
      <MemoryRouter initialEntries={['/checkout?step=details']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<div>Checkout Page</div>} />
          </Route>
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('/checkout?step=details')).toBeInTheDocument();
  });

  it('renders outlet if user is authenticated and no roles are required', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.CUSTOMER,
        isCustomer: true,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });

  it('redirects if user role is not allowed', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.ADMIN,
        isAdmin: true,
        canAccessAdminPanel: true,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[AUTH_ROLES.SUPER_ADMIN]}
                redirectTo={ROUTES.SHOP}
              />
            }
          >
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>
          <Route path={ROUTES.SHOP} element={<div>Shop Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Shop Page')).toBeInTheDocument();
  });

  it('renders outlet if user role is allowed', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.SUPER_ADMIN,
        isSuperAdmin: true,
        canAccessAdminPanel: true,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[AUTH_ROLES.ADMIN, AUTH_ROLES.SUPER_ADMIN]}
              />
            }
          >
            <Route path="/protected" element={<div>Protected Page</div>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Page')).toBeInTheDocument();
  });
});
