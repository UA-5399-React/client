import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { Features } from './Features';

describe('Component: Features', () => {
  it('should render all 4 feature items', () => {
    render(<Features />);

    expect(screen.getByText('Free Shipping')).toBeInTheDocument();
    expect(screen.getByText('Money-back')).toBeInTheDocument();
    expect(screen.getByText('Secure Payments')).toBeInTheDocument();
    expect(screen.getByText('24/7 Support')).toBeInTheDocument();
  });

  it('should render all feature descriptions', () => {
    render(<Features />);

    expect(screen.getByText('Order above $200')).toBeInTheDocument();
    expect(screen.getByText('30 days guarantee')).toBeInTheDocument();
    expect(screen.getByText('Secured by Stripe')).toBeInTheDocument();
    expect(screen.getByText('Phone and Email support')).toBeInTheDocument();
  });

  it('should render icons with aria-hidden', () => {
    const { container } = render(<Features />);

    const icons = container.querySelectorAll('svg[aria-hidden="true"]');
    expect(icons).toHaveLength(4);
  });

  it('should render inside a section element', () => {
    const { container } = render(<Features />);

    expect(container.querySelector('section')).toBeInTheDocument();
  });
});
