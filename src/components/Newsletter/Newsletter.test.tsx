import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { Newsletter } from './Newsletter';

describe('Component: Newsletter', () => {
  it('should render heading and description', () => {
    render(<Newsletter />);

    expect(screen.getByText('Join Our Newsletter')).toBeInTheDocument();
    expect(
      screen.getByText('Sign up for deals, new products and promotions'),
    ).toBeInTheDocument();
  });

  it('should render email input and signup button', () => {
    render(<Newsletter />);

    expect(screen.getByPlaceholderText('Email address')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Signup' })).toBeInTheDocument();
  });

  it('should render decorative images', () => {
    render(<Newsletter />);

    expect(screen.getByAltText('headphones')).toBeInTheDocument();
    expect(screen.getByAltText('laptop')).toBeInTheDocument();
  });

  it('should render a form element', () => {
    const { container } = render(<Newsletter />);

    expect(container.querySelector('form')).toBeInTheDocument();
  });
});
