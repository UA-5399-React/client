import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { render, screen } from '@/utils/test-utils';

import { AdminRoute } from './AdminRoute';

vi.mock('@/hooks/useAuth', () => ({
  useAuth: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<Record<string, unknown>>();

  return {
    ...actual,
    Navigate: vi.fn(({ to, replace }) => (
      <div data-testid="navigate" data-to={to} data-replace={String(replace)} />
    )),
    Outlet: vi.fn(() => <div data-testid="outlet">Outlet</div>),
  };
});

describe('AdminRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('redirects to LOGIN if user is not authenticated', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: false,
      isAdmin: false,
      isSuperAdmin: false,
    });

    render(<AdminRoute />);

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', ROUTES.LOGIN);
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });

  it('redirects to SHOP if user is authenticated but not admin', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: false,
      isSuperAdmin: false,
    });

    render(<AdminRoute />);

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toHaveAttribute('data-to', ROUTES.SHOP);
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });

  it('renders Outlet if user is admin', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: true,
      isSuperAdmin: false,
    });

    render(<AdminRoute />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('renders Outlet if user is superadmin', () => {
    (useAuth as Mock).mockReturnValue({
      isAuth: true,
      isAdmin: false,
      isSuperAdmin: true,
    });

    render(<AdminRoute />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });
});
