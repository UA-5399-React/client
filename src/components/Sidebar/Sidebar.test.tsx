import { describe, expect, it, vi } from 'vitest';

import { AUTH_ROLES } from '@/constants';
import { ThemeProvider } from '@/contexts/ThemeProvider';
import { useAuth } from '@/hooks/useAuth';
import { render, screen, userEvent } from '@/utils/test-utils';

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
  role: AUTH_ROLES.ADMIN as string | null,
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider>{ui}</ThemeProvider>);

describe('UI Component: Sidebar', () => {
  it('should render the sidebar', () => {
    vi.mocked(useAuth).mockReturnValue(defaultAuthMock);
    renderWithTheme(<Sidebar />);

    expect(screen.getByText('Products')).toBeInTheDocument();
    expect(screen.getByText('Settings')).toBeInTheDocument();
  });

  it('should call logout when the logout button is clicked', async () => {
    const mockLogout = vi.fn();
    vi.mocked(useAuth).mockReturnValue({
      ...defaultAuthMock,
      isAdmin: false,
      logout: mockLogout,
    });

    const user = userEvent.setup();
    renderWithTheme(<Sidebar />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    await user.click(logoutButton);

    expect(mockLogout).toHaveBeenCalledOnce();
  });
});
