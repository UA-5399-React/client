import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { MainLayout } from './MainLayout';

vi.mock('../Header', () => ({
  Header: () => <header data-testid="header">Header</header>,
}));

vi.mock('../Footer', () => ({
  Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Component: MainLayout', () => {
  it('should render Header and Footer', () => {
    render(<MainLayout />);

    expect(screen.getByTestId('header')).toBeInTheDocument();
    expect(screen.getByTestId('footer')).toBeInTheDocument();
  });

  it('should render main element', () => {
    const { container } = render(<MainLayout />);

    expect(container.querySelector('main')).toBeInTheDocument();
  });

  it('should render Outlet inside main', () => {
    const { container } = render(<MainLayout />);

    const main = container.querySelector('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('flex-1');
  });
});
