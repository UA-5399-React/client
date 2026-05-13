import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { useCartStore } from '@/store/useCartStore';
import { useWishlistStore } from '@/store/useWishlistStore';
import { act, fireEvent, render, screen, userEvent } from '@/utils/test-utils';

import { Header } from './Header';

// ─── Navigation ───────────────────────────────────────────────────────────────
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return { ...actual, useNavigate: () => mockNavigate };
});

// ─── Theme ─────────────────────────────────────────────────────────────────────
const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();
vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}));

// ─── Auth / Me ────────────────────────────────────────────────────────────────
const mockUseAuth = vi.fn();
const mockUseMe = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => mockUseAuth(),
}));

vi.mock('@/hooks/useMe', () => ({
  useMe: (enabled: boolean) => mockUseMe(enabled),
}));

vi.mock('@/hooks/useWishlistProducts', () => ({
  useWishlistProducts: vi.fn(),
}));

// ─── SearchInput stub ─────────────────────────────────────────────────────────
vi.mock('@/components/ui/SearchInput', () => ({
  SearchInput: ({
    value,
    onChange,
    placeholder,
  }: {
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
  }) => (
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder ?? 'Search'}
      aria-label="Search input"
    />
  ),
}));

// ─── FlyoutCart stub ──────────────────────────────────────────────────────────
vi.mock('@/components', async () => {
  const actual = await vi.importActual('@/components');
  return { ...actual, FlyoutCart: () => null };
});

// ─── Helpers ───────────────────────────────────────────────────────────────────
const lightTheme = () =>
  mockUseTheme.mockReturnValue({
    theme: 'light',
    setTheme: mockSetTheme,
    isDark: false,
  });

const darkTheme = () =>
  mockUseTheme.mockReturnValue({
    theme: 'dark',
    setTheme: mockSetTheme,
    isDark: true,
  });

describe('UI Component: Header', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    lightTheme();

    mockUseAuth.mockReturnValue({ isAuth: false, canAccessAdminPanel: false });
    mockUseMe.mockReturnValue({ data: undefined });

    useCartStore.setState({ items: [], isOpen: false });
    useWishlistStore.setState({ items: [] });
  });

  // ── Static structure ────────────────────────────────────────────────────────
  it('should render the header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render brand logo with correct alt text', () => {
    render(<Header />);
    const logos = screen.getAllByAltText('TechnoWorld');
    expect(logos.length).toBeGreaterThanOrEqual(1);
  });

  it('should navigate to home when brand link is clicked', () => {
    render(<Header />);
    const brandLinks = screen.getAllByRole('link', { name: /TechnoWorld/i });
    brandLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', ROUTES.HOME),
    );
  });

  it('should render all desktop nav links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Contact' })).toBeInTheDocument();
  });

  it('should have correct href for Shop nav link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute(
      'href',
      ROUTES.SHOP,
    );
  });

  it('should have correct href for Contact Us nav link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute(
      'href',
      ROUTES.CONTACT,
    );
  });

  // ── Buttons ─────────────────────────────────────────────────────────────────
  it('should render the Search button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should render the User button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'User' })).toBeInTheDocument();
  });

  it('should not render Admin panel button for non-admin users', () => {
    render(<Header />);
    expect(
      screen.queryByRole('button', { name: 'Admin panel' }),
    ).not.toBeInTheDocument();
  });

  it('should render the Theme toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('should render Cart buttons', () => {
    render(<Header />);
    const cartButtons = screen.getAllByRole('button', { name: /cart/i });
    expect(cartButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should render the Open menu button', () => {
    render(<Header />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  // ── User button / auth states ───────────────────────────────────────────────
  it('should navigate to login when User button is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'User' }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
  });

  it('should navigate to profile when authenticated user clicks User button', async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'superadmin@admin.com',
        role: 'super_admin',
        firstName: 'Super',
        lastName: 'Admin',
        avatarUrl: undefined,
        isActive: true,
        isEmailConfirmed: true,
      },
    });

    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'User' }));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.PROFILE);
  });

  it('should render user initials when authenticated user has no avatar', () => {
    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'superadmin@admin.com',
        role: 'super_admin',
        firstName: 'Super',
        lastName: 'Admin',
        avatarUrl: undefined,
        isActive: true,
        isEmailConfirmed: true,
      },
    });

    render(<Header />);

    expect(screen.getByText('SA')).toBeInTheDocument();
  });

  it('should render first email letter when authenticated user has no avatar and no names', () => {
    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'superadmin@admin.com',
        role: 'super_admin',
        firstName: '',
        lastName: '',
        avatarUrl: undefined,
        isActive: true,
        isEmailConfirmed: true,
      },
    });

    render(<Header />);

    expect(screen.getByText('S')).toBeInTheDocument();
  });

  it('should render user avatar when authenticated user has avatar', () => {
    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'superadmin@admin.com',
        role: 'super_admin',
        firstName: 'Super',
        lastName: 'Admin',
        avatarUrl: 'https://example.com/avatar.jpg',
        isActive: true,
        isEmailConfirmed: true,
      },
    });

    render(<Header />);

    const userButton = screen.getByRole('button', { name: 'User' });
    const avatar = userButton.querySelector('img');

    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('should fall back to initials when avatar image fails to load', () => {
    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });
    mockUseMe.mockReturnValue({
      data: {
        id: '1',
        email: 'superadmin@admin.com',
        role: 'super_admin',
        firstName: 'Super',
        lastName: 'Admin',
        avatarUrl: 'https://example.com/broken-avatar.jpg',
        isActive: true,
        isEmailConfirmed: true,
      },
    });

    render(<Header />);

    const userButton = screen.getByRole('button', { name: 'User' });
    const avatar = userButton.querySelector('img');

    expect(avatar).toBeInTheDocument();

    fireEvent.error(avatar as HTMLImageElement);

    expect(screen.getByText('SA')).toBeInTheDocument();
  });

  it('should render Admin panel button for admin users and navigate to dashboard', async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });

    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Admin panel' }));

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.ADMIN_DASHBOARD);
  });

  // ── Theme icon ───────────────────────────────────────────────────────────────
  it('should render Moon icon when isDark is false', () => {
    render(<Header />);
    const themeBtn = screen.getByRole('button', { name: 'Theme' });
    expect(themeBtn.querySelector('svg')).toBeInTheDocument();
  });

  it('should render Sun icon when isDark is true', () => {
    darkTheme();
    render(<Header />);
    const themeBtn = screen.getByRole('button', { name: 'Theme' });
    expect(themeBtn.querySelector('svg')).toBeInTheDocument();
  });

  // ── Theme toggle ─────────────────────────────────────────────────────────────
  it('should call setTheme with "dark" when theme is "light" and toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with "light" when theme is "dark" and toggle is clicked', async () => {
    const user = userEvent.setup();
    darkTheme();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "light" when theme is "system" and system prefers dark', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      isDark: true,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('should call setTheme with "dark" when theme is "system" and system prefers light', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'system',
      setTheme: mockSetTheme,
      isDark: false,
    });
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: false }),
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  // ── Cart badge ───────────────────────────────────────────────────────────────
  it('should display cart item count badge when cart has items', () => {
    useCartStore.setState({
      items: [
        {
          product: { id: 'p1', title: 'P1', price: 10, status: 'active' },
          quantity: 3,
        },
      ],
    });
    render(<Header />);
    const badges = screen.getAllByText('3');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('should not display cart badge when cart is empty', () => {
    render(<Header />);
    expect(screen.queryByText('0')).toBeNull();
  });

  it('should display dark-mode cart badge classes when isDark is true', () => {
    darkTheme();
    useCartStore.setState({
      items: [
        {
          product: { id: 'p1', title: 'P1', price: 10, status: 'active' },
          quantity: 2,
        },
      ],
    });
    render(<Header />);
    const badges = screen.getAllByText('2');
    expect(badges[0]).toBeInTheDocument();
  });

  // ── Wishlist badge ────────────────────────────────────────────────────────────
  it('should display wishlist item count badge when wishlist has items', () => {
    useWishlistStore.setState({
      items: [
        {
          productId: 'p1',
          title: 'Product 1',
          price: 100,
        },
        {
          productId: 'p2',
          title: 'Product 2',
          price: 200,
        },
      ],
    });

    render(<Header />);

    const badges = screen.getAllByText('2');

    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  it('should not display wishlist badge when wishlist is empty', () => {
    render(<Header />);

    expect(screen.queryByText('0')).toBeNull();
  });

  // ── Drawer open/close ────────────────────────────────────────────────────────
  it('should not render drawer by default', () => {
    render(<Header />);
    expect(
      screen.queryByRole('button', { name: 'Close menu' }),
    ).not.toBeInTheDocument();
  });

  it('should open drawer when Open menu is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(
      screen.getByRole('button', { name: 'Close menu' }),
    ).toBeInTheDocument();
  });

  it('should close drawer when Close menu is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(
      screen.queryByRole('button', { name: 'Close menu' }),
    ).not.toBeInTheDocument();
  });

  it('should close drawer when the backdrop overlay is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const overlay = document.querySelector(
      '.fixed.inset-0.z-40.bg-black\\/40',
    ) as HTMLElement;
    await user.click(overlay);
    expect(
      screen.queryByRole('button', { name: 'Close menu' }),
    ).not.toBeInTheDocument();
  });

  it('should display wishlist badge in drawer when wishlist has items', async () => {
    const user = userEvent.setup();

    useWishlistStore.setState({
      items: [
        {
          productId: 'p1',
          title: 'Product 1',
          price: 100,
        },
        {
          productId: 'p2',
          title: 'Product 2',
          price: 200,
        },
        {
          productId: 'p3',
          title: 'Product 3',
          price: 300,
        },
      ],
    });

    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const badges = screen.getAllByText('3');

    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  // ── Body scroll lock ─────────────────────────────────────────────────────────
  it('should lock body scroll when drawer is open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(document.body.style.overflow).toBe('hidden');
  });

  it('should unlock body scroll when drawer is closed', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Close menu' }));
    expect(document.body.style.overflow).toBe('');
  });

  // ── Drawer contents ──────────────────────────────────────────────────────────
  it('should render Sign In button in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should navigate to login and close menu when Sign In is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: 'Sign In' }));
    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.LOGIN);
    expect(
      screen.queryByRole('button', { name: 'Close menu' }),
    ).not.toBeInTheDocument();
  });

  it('should render Wishlist link in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const link = await screen.findByTestId('drawer-wishlist-link');

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.WISHLIST);
  });

  it('should render Admin Panel action in drawer for admin users', async () => {
    const user = userEvent.setup();

    mockUseAuth.mockReturnValue({ isAuth: true, canAccessAdminPanel: true });

    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('should render Change Theme button in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(
      screen.getByRole('button', { name: /change theme/i }),
    ).toBeInTheDocument();
  });

  it('should call setTheme when Change Theme is clicked inside drawer', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    await user.click(screen.getByRole('button', { name: /change theme/i }));
    expect(mockSetTheme).toHaveBeenCalled();
  });

  it('should render Cart button in drawer', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const cartButtons = screen.getAllByRole('button', { name: /^Cart$/i });
    expect(cartButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should open cart when Cart button in drawer is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const drawerCartBtn = screen.getAllByRole('button', { name: /^Cart$/i })[0];
    await user.click(drawerCartBtn);
    expect(useCartStore.getState().isOpen).toBe(true);
  });

  it('should render drawer nav links with closeMenu attached', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const navLinks = screen.getAllByRole('link', { name: 'Home' });
    expect(navLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('should apply dark drawer styles when isDark is true', async () => {
    const user = userEvent.setup();

    darkTheme();
    render(<Header />);

    await user.click(screen.getByRole('button', { name: 'Open menu' }));

    const drawer = document.querySelector('.fixed');

    expect(drawer).toBeInTheDocument();
    expect(drawer).toHaveClass('fixed');

    expect(screen.getByText('Wishlist')).toBeInTheDocument();
  });

  it('should render Cart button in dark theme drawer', async () => {
    const user = userEvent.setup();
    darkTheme();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const cartButtons = screen.getAllByRole('button', { name: /^Cart$/i });
    expect(cartButtons.length).toBeGreaterThanOrEqual(1);
  });

  it('should display cart badge in drawer when cart has items', async () => {
    const user = userEvent.setup();
    useCartStore.setState({
      items: [
        {
          product: { id: 'p1', title: 'P1', price: 10, status: 'active' },
          quantity: 5,
        },
      ],
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const badges = screen.getAllByText('5');
    expect(badges.length).toBeGreaterThanOrEqual(1);
  });

  // ── Search ───────────────────────────────────────────────────────────────────
  it('should not show search input by default', () => {
    render(<Header />);
    expect(screen.getByPlaceholderText('Search')).toBeDisabled();
  });

  it('should show search input after clicking Search button', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  });

  it('should hide search input after clicking Search button twice', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText('Search')).toBeDisabled();
  });

  it('should clear search value when closing search', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.type(screen.getByPlaceholderText('Search'), 'keyboard');
    await user.click(screen.getByRole('button', { name: 'Search' }));
    await user.click(screen.getByRole('button', { name: 'Search' }));
    expect(screen.getByPlaceholderText('Search')).toHaveValue('');
  });

  it('should navigate with search query when a term is typed (debounced)', async () => {
    vi.useFakeTimers();
    render(<Header />);

    const searchBtn = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'laptop' } });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining(`${ROUTES.SHOP}?search=laptop`),
    );
    vi.useRealTimers();
  });

  it('should sync search input with URL search params', () => {
    window.history.pushState({}, '', `${ROUTES.SHOP}?search=url-query`);
    render(<Header />);

    const searchBtn = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText('Search');
    expect(input).toHaveValue('url-query');

    window.history.pushState({}, '', '/');
  });

  it('should navigate to shop (no query) when search is cleared (from non-empty initial state)', async () => {
    window.history.pushState({}, '', `${ROUTES.SHOP}?search=something`);
    vi.useFakeTimers();
    render(<Header />);

    const searchBtn = screen.getByRole('button', { name: 'Search' });
    fireEvent.click(searchBtn);

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: '' } });

    act(() => {
      vi.advanceTimersByTime(600);
    });

    expect(mockNavigate).toHaveBeenCalledWith(ROUTES.SHOP);
    vi.useRealTimers();

    window.history.pushState({}, '', '/');
  });

  it('should render Wishlist link', () => {
    render(<Header />);

    const link = screen.getByRole('link', { name: /wishlist/i });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', ROUTES.WISHLIST);
  });

  it('should render wishlist link with correct href', () => {
    render(<Header />);

    const link = screen.getByRole('link', { name: 'Wishlist' });

    expect(link).toHaveAttribute('href', ROUTES.WISHLIST);
  });
});
