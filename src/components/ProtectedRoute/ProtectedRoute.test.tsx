import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
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
  logout: vi.fn(),
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

  it('renders outlet if user is authenticated and no roles are required', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.USER,
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
