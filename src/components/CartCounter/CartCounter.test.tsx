import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { useTheme } from '@/hooks/useTheme';
import { useCartStore } from '@/store/useCartStore';

import { CartCounter } from './CartCounter';

vi.mock('@/store/useCartStore', () => ({
  useCartStore: vi.fn(),
}));

vi.mock('@/hooks/useTheme', () => ({
  useTheme: vi.fn(),
}));

describe('CartCounter', () => {
  it('does not render when cart is empty', () => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [],
    } as never);

    vi.mocked(useTheme).mockReturnValue({
      isDark: false,
    } as never);

    const { container } = render(<CartCounter />);

    expect(container).toBeEmptyDOMElement();
  });

  it('does not render when total quantity is 0', () => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [{ quantity: 0 }, { quantity: 0 }],
    } as never);

    vi.mocked(useTheme).mockReturnValue({
      isDark: false,
    } as never);

    const { container } = render(<CartCounter />);

    expect(container).toBeEmptyDOMElement();
  });

  it('renders total quantity for light theme', () => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [{ quantity: 2 }, { quantity: 3 }],
    } as never);

    vi.mocked(useTheme).mockReturnValue({
      isDark: false,
    } as never);

    render(<CartCounter />);

    const counter = screen.getByText('5');
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveClass('bg-black', 'text-white');
  });

  it('renders total quantity for dark theme', () => {
    vi.mocked(useCartStore).mockReturnValue({
      items: [{ quantity: 1 }],
    } as never);

    vi.mocked(useTheme).mockReturnValue({
      isDark: true,
    } as never);

    render(<CartCounter />);

    const counter = screen.getByText('1');
    expect(counter).toBeInTheDocument();
    expect(counter).toHaveClass('bg-white', 'text-black');
  });
});
