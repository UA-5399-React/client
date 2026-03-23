import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';

import { AccountSidebar } from './AccountSidebar';

describe('AccountSidebar', () => {
  const mockUser = {
    firstName: 'Anna',
    lastName: 'Smith',
    email: 'anna@example.com',
    avatarUrl: 'https://example.com/avatar.jpg',
  };

  const renderComponent = (
    props?: Partial<React.ComponentProps<typeof AccountSidebar>>,
    initialEntries: string[] = [ROUTES.PROFILE],
  ) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <AccountSidebar
          user={mockUser as never}
          onAvatarClick={vi.fn()}
          onLogout={vi.fn()}
          {...props}
        />
      </MemoryRouter>,
    );
  };

  it('renders user full name', () => {
    renderComponent();

    expect(screen.getByText('Anna Smith')).toBeInTheDocument();
  });

  it('renders fallback name "User" when first and last name are missing', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
        <AccountSidebar
          user={{ ...mockUser, firstName: '', lastName: '' } as never}
        />
      </MemoryRouter>,
    );

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders avatar from user avatarUrl', () => {
    renderComponent();

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders default avatar when avatarUrl is missing', () => {
    render(
      <MemoryRouter initialEntries={[ROUTES.PROFILE]}>
        <AccountSidebar user={{ ...mockUser, avatarUrl: '' } as never} />
      </MemoryRouter>,
    );

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toHaveAttribute(
      'src',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
    );
  });

  it('calls onAvatarClick when avatar button is clicked', () => {
    const onAvatarClick = vi.fn();

    renderComponent({ onAvatarClick });

    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);

    expect(onAvatarClick).toHaveBeenCalledTimes(1);
  });

  it('calls onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();

    renderComponent({ onLogout });

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('renders account navigation link with correct href', () => {
    renderComponent();

    const accountLink = screen.getByRole('link', { name: /account/i });
    expect(accountLink).toBeInTheDocument();
    expect(accountLink).toHaveAttribute('href', ROUTES.PROFILE);
  });

  it('renders disabled items Orders and Wishlist', () => {
    renderComponent();

    expect(screen.getByText('Orders')).toHaveAttribute('aria-disabled', 'true');
    expect(screen.getByText('Wishlist')).toHaveAttribute(
      'aria-disabled',
      'true',
    );
  });

  it('applies active class to account link when route is profile', () => {
    renderComponent({}, [ROUTES.PROFILE]);

    const accountLink = screen.getByRole('link', { name: /account/i });
    expect(accountLink.className).toContain('text-black');
  });

  it('does not apply active class to account link when route is not profile', () => {
    renderComponent({}, ['/some-other-route']);

    const accountLink = screen.getByRole('link', { name: /account/i });
    expect(accountLink.className).toContain('border-transparent');
  });
});
