import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { render, screen, userEvent } from '@/utils/test-utils';

import { Header } from './Header';

const mockSetTheme = vi.fn();
const mockUseTheme = vi.fn();

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
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

  it('should render the brand link TechnoWorld.', () => {
    render(<Header />);
    expect(
      screen.getByRole('link', { name: 'TechnoWorld.' }),
    ).toBeInTheDocument();
  });

  it('should have correct href on the brand link', () => {
    render(<Header />);
    expect(screen.getByRole('link', { name: 'TechnoWorld.' })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
  });

  it('should render all nav links', () => {
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

  it('should render the Cart link with correct href', () => {
    render(<Header />);
    const cartLink = screen.getByRole('link', { name: /cart/i });
    expect(cartLink).toHaveAttribute('href', ROUTES.CART);
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
});
