import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { render, screen } from '@/utils/test-utils';

import { ProtectedRoute } from './ProtectedRoute';

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

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders Outlet when user is authenticated', () => {
    (useAuth as Mock).mockReturnValue({ isAuth: true });

    render(<ProtectedRoute />);

    expect(screen.getByTestId('outlet')).toBeInTheDocument();
    expect(screen.queryByTestId('navigate')).not.toBeInTheDocument();
  });

  it('redirects to LOGIN when user is not authenticated', () => {
    (useAuth as Mock).mockReturnValue({ isAuth: false });

    render(<ProtectedRoute />);

    expect(screen.queryByTestId('outlet')).not.toBeInTheDocument();

    const navigate = screen.getByTestId('navigate');
    expect(navigate).toBeInTheDocument();
    expect(navigate).toHaveAttribute('data-to', ROUTES.LOGIN);
    expect(navigate).toHaveAttribute('data-replace', 'true');
  });
});
