import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { SaleBanner } from './SaleBanner';

describe('Component: SaleBanner', () => {
  it('should render sale text and heading', () => {
    render(<SaleBanner />);

    expect(screen.getByText('SALE UP TO 35% OFF')).toBeInTheDocument();
    expect(
      screen.getByText('HUNDREDS of New lower prices!'),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/It's more affordable than ever/i),
    ).toBeInTheDocument();
  });

  it('should render Shop Now link', () => {
    render(<SaleBanner />);

    expect(screen.getByRole('link', { name: /shop now/i })).toBeInTheDocument();
  });

  it('should render banner image', () => {
    render(<SaleBanner />);

    expect(screen.getByAltText('Sale Banner')).toBeInTheDocument();
  });
});
