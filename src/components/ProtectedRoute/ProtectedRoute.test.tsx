import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { AUTH_ROLES, ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';

import { ProtectedRoute } from './ProtectedRoute';

vi.mock('@/hooks/useAuth');

const MockPage = () => <div>Protected Content</div>;

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
  it('redirects to login if not authenticated', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: false,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/protected" element={<MockPage />} />
          </Route>
          <Route path={ROUTES.LOGIN} element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
  });

  it('renders outlet if authenticated and no roles required', () => {
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
            <Route path="/protected" element={<MockPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('redirects if role is not allowed', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.USER,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            element={
              <ProtectedRoute
                allowedRoles={[AUTH_ROLES.ADMIN]}
                redirectTo="/forbidden"
              />
            }
          >
            <Route path="/protected" element={<MockPage />} />
          </Route>
          <Route path="/forbidden" element={<div>Forbidden</div>} />
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Forbidden')).toBeInTheDocument();
  });

  it('renders outlet if role is allowed', () => {
    vi.mocked(useAuth).mockReturnValue(
      createUseAuthMock({
        isAuth: true,
        role: AUTH_ROLES.ADMIN,
      }),
    );

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route element={<ProtectedRoute allowedRoles={[AUTH_ROLES.ADMIN]} />}>
            <Route path="/protected" element={<MockPage />} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });
});
