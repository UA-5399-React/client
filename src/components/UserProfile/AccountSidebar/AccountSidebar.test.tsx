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
    renderComponent({
      user: { ...mockUser, firstName: '', lastName: '' } as never,
    });

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders avatar image when avatarUrl exists', () => {
    renderComponent();

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('does not render avatar image when avatarUrl is missing', () => {
    renderComponent({
      user: { ...mockUser, avatarUrl: '' } as never,
    });

    expect(screen.queryByAltText('avatar')).not.toBeInTheDocument();
  });

  it('renders avatar placeholder when avatarUrl is missing', () => {
    const { container } = renderComponent({
      user: { ...mockUser, avatarUrl: '' } as never,
    });

    expect(screen.queryByAltText('avatar')).not.toBeInTheDocument();

    const placeholder = container.querySelector(
      '.bg-\\[rgb\\(var\\(--color-gray-200\\)\\)\\]',
    );
    expect(placeholder).toBeInTheDocument();
  });

  it('calls onAvatarClick when file is selected', () => {
    const onAvatarClick = vi.fn();

    const { container } = renderComponent({ onAvatarClick });

    const input = container.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;
    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onAvatarClick).toHaveBeenCalledTimes(1);
    expect(onAvatarClick).toHaveBeenCalledWith(file);
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

    const ordersLink = screen.getByRole('link', { name: /orders/i });
    expect(ordersLink).toBeInTheDocument();
    expect(ordersLink).toHaveAttribute('href', ROUTES.MYORDERS);

    expect(screen.getByText('Wishlist')).toBeInTheDocument();
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
