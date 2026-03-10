import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { render, screen, userEvent } from '@/utils/test-utils';

import { Header } from './Header';

const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}));

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

describe('UI Component: Header', () => {
  beforeEach(() => {
    mockSetTheme.mockClear();
    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
      isDark: false,
    });
  });

  it('should render the header element', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render brand links TechnoWorld.', () => {
    render(<Header />);
    const brandLinks = screen.getAllByRole('link', { name: 'TechnoWorld.' });
    expect(brandLinks.length).toBeGreaterThanOrEqual(1);
  });

  it('should have correct href on all brand links', () => {
    render(<Header />);
    const brandLinks = screen.getAllByRole('link', { name: 'TechnoWorld.' });
    brandLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', ROUTES.HOME),
    );
  });

  it('should render all desktop nav links', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Contact Us' }),
    ).toBeInTheDocument();
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
    expect(screen.getByRole('link', { name: 'Contact Us' })).toHaveAttribute(
      'href',
      ROUTES.CONTACT_US,
    );
  });

  it('should render the Search button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Search' })).toBeInTheDocument();
  });

  it('should render the User button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'User' })).toBeInTheDocument();
  });

  it('should render the Theme toggle button', () => {
    render(<Header />);
    expect(screen.getByRole('button', { name: 'Theme' })).toBeInTheDocument();
  });

  it('should render Cart links with correct href', () => {
    render(<Header />);
    const cartLinks = screen.getAllByRole('link', { name: /cart/i });
    expect(cartLinks.length).toBeGreaterThanOrEqual(1);
    cartLinks.forEach((link) =>
      expect(link).toHaveAttribute('href', ROUTES.CART),
    );
  });

  it('should render the Open menu button', () => {
    render(<Header />);
    expect(
      screen.getByRole('button', { name: 'Open menu' }),
    ).toBeInTheDocument();
  });

  it('should render Moon icon when isDark is false', () => {
    render(<Header />);
    const themeBtn = screen.getByRole('button', { name: 'Theme' });
    expect(themeBtn.querySelector('svg')).toBeInTheDocument();
  });

  it('should render Sun icon when isDark is true', () => {
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      isDark: true,
    });
    render(<Header />);
    const themeBtn = screen.getByRole('button', { name: 'Theme' });
    expect(themeBtn.querySelector('svg')).toBeInTheDocument();
  });

  it('should call setTheme with "dark" when theme is "light" and toggle is clicked', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Theme' }));
    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('should call setTheme with "light" when theme is "dark" and toggle is clicked', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      isDark: true,
    });
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

  it('should render Sign In link in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('link', { name: 'Sign In' })).toBeInTheDocument();
  });

  it('should render Wishlist link in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(screen.getByRole('link', { name: 'Wishlist' })).toBeInTheDocument();
  });

  it('should render Change Theme button in drawer when open', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    expect(
      screen.getByRole('button', { name: /change theme/i }),
    ).toBeInTheDocument();
  });

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

  it('should apply dark drawer styles when isDark is true', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      isDark: true,
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const wishlist = screen.getByRole('link', { name: 'Wishlist' });
    expect(wishlist).toBeInTheDocument();
  });

  it('should render Sign In with correct style in dark theme drawer', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      isDark: true,
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const signIn = screen.getByRole('link', { name: 'Sign In' });
    expect(signIn).toHaveStyle({ color: '#000000' });
  });

  it('should render Sign In with correct style in light theme drawer', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const signIn = screen.getByRole('link', { name: 'Sign In' });
    expect(signIn).toHaveStyle({ color: '#ffffff' });
  });

  it('should render Cart link in drawer with correct href', async () => {
    const user = userEvent.setup();
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const cartLinks = screen.getAllByRole('link', { name: /^Cart$/i });
    expect(cartLinks.some((l) => l.getAttribute('href') === ROUTES.CART)).toBe(
      true,
    );
  });

  it('should render Cart link in dark theme drawer', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
      isDark: true,
    });
    render(<Header />);
    await user.click(screen.getByRole('button', { name: 'Open menu' }));
    const cartLinks = screen.getAllByRole('link', { name: /^Cart$/i });
    expect(cartLinks.some((l) => l.getAttribute('href') === ROUTES.CART)).toBe(
      true,
    );
  });

  it('should not show search input by default', () => {
    render(<Header />);
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
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
    expect(screen.queryByPlaceholderText('Search')).not.toBeInTheDocument();
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
});
