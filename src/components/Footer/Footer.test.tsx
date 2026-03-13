import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';
import { render, screen } from '@/utils/test-utils';

import { Footer } from './Footer';

const mockUseTheme = vi.fn();

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => mockUseTheme(),
}));

describe('UI Component: Footer', () => {
  beforeEach(() => {
    mockUseTheme.mockReturnValue({ isDark: false });
  });

  it('should render the footer element', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
  });

  it('should render the store tagline', () => {
    render(<Footer />);
    expect(screen.getByText('Gift & Decoration Store')).toBeInTheDocument();
  });

  it('should render the copyright notice', () => {
    render(<Footer />);
    expect(
      screen.getByText(/Copyright © 2026 TechnoWorld/),
    ).toBeInTheDocument();
  });

  it('should render all nav links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Shop' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Product' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Blog' })).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: 'Contact Us' }),
    ).toBeInTheDocument();
  });

  it('should have correct href for Home nav link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute(
      'href',
      ROUTES.HOME,
    );
  });

  it('should have correct href for Shop nav link', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: 'Shop' })).toHaveAttribute(
      'href',
      ROUTES.SHOP,
    );
  });

  it('should render Privacy Policy link', () => {
    render(<Footer />);
    expect(
      screen.getByRole('link', { name: 'Privacy Policy' }),
    ).toBeInTheDocument();
  });

  it('should render Terms of Use link', () => {
    render(<Footer />);
    expect(
      screen.getByRole('link', { name: 'Terms of Use' }),
    ).toBeInTheDocument();
  });

  it('should render three social icon links', () => {
    const { container } = render(<Footer />);
    expect(container.querySelectorAll('footer svg').length).toBe(3);
  });

  it('should apply dark background when isDark is false', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveClass('bg-[#141718]');
  });

  it('should apply white text when isDark is false', () => {
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveClass('text-white');
  });

  it('should apply white background when isDark is true', () => {
    mockUseTheme.mockReturnValue({ isDark: true });
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveClass('bg-white');
  });

  it('should apply black text when isDark is true', () => {
    mockUseTheme.mockReturnValue({ isDark: true });
    render(<Footer />);
    expect(screen.getByRole('contentinfo')).toHaveClass('text-black');
  });
});
