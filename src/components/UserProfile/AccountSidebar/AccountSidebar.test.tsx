import { MemoryRouter } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { ROUTES } from '@/constants';

import { AccountSidebar } from './AccountSidebar';

const mockUser = {
  id: '1',
  email: 'user@test.com',
  firstName: 'Genadiy',
  lastName: 'Pascal',
  avatarUrl: 'https://example.com/avatar.jpg',
  role: 'USER',
  isActive: true,
  isEmailConfirmed: true,
};

const userWithoutName = {
  id: '2',
  email: 'empty@test.com',
  firstName: '',
  lastName: '',
  avatarUrl: '',
  role: 'USER',
  isActive: true,
  isEmailConfirmed: true,
};

function renderComponent(
  props?: Partial<React.ComponentProps<typeof AccountSidebar>>,
  initialEntries: string[] = ['/profile'],
) {
  const defaultProps: React.ComponentProps<typeof AccountSidebar> = {
    user: mockUser,
    onLogout: vi.fn(),
    onAvatarClick: vi.fn(),
    isAvatarUploading: false,
  };

  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AccountSidebar {...defaultProps} {...props} />
    </MemoryRouter>,
  );
}

describe('AccountSidebar', () => {
  it('renders user full name', () => {
    renderComponent();

    expect(screen.getByText('Genadiy Pascal')).toBeInTheDocument();
  });

  it('renders fallback name when first and last name are empty', () => {
    renderComponent({ user: userWithoutName });

    expect(screen.getByText('User')).toBeInTheDocument();
  });

  it('renders avatar image when avatarUrl exists', () => {
    renderComponent();

    const avatar = screen.getByAltText('avatar');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveAttribute('src', mockUser.avatarUrl);
  });

  it('renders fallback avatar when avatarUrl does not exist', () => {
    renderComponent({
      user: {
        ...mockUser,
        avatarUrl: '',
      },
    });

    expect(screen.queryByAltText('avatar')).not.toBeInTheDocument();
  });

  it('calls onAvatarClick when file is selected', () => {
    const onAvatarClick = vi.fn();
    renderComponent({ onAvatarClick });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });

    fireEvent.change(input, {
      target: { files: [file] },
    });

    expect(onAvatarClick).toHaveBeenCalledTimes(1);
    expect(onAvatarClick).toHaveBeenCalledWith(file);
  });

  it('does not call onAvatarClick when no file is selected', () => {
    const onAvatarClick = vi.fn();
    renderComponent({ onAvatarClick });

    const input = document.querySelector(
      'input[type="file"]',
    ) as HTMLInputElement;

    fireEvent.change(input, {
      target: { files: [] },
    });

    expect(onAvatarClick).not.toHaveBeenCalled();
  });

  it('disables avatar upload button when isAvatarUploading is true', () => {
    renderComponent({ isAvatarUploading: true });

    const buttons = screen.getAllByRole('button');
    const uploadButton = buttons.find(
      (button) => button !== screen.getByText('Log Out'),
    );

    expect(uploadButton).toBeDisabled();
  });

  it('calls onLogout when logout button is clicked', () => {
    const onLogout = vi.fn();
    renderComponent({ onLogout });

    fireEvent.click(screen.getByRole('button', { name: /log out/i }));

    expect(onLogout).toHaveBeenCalledTimes(1);
  });

  it('renders navigation links', () => {
    renderComponent();

    expect(screen.getByRole('link', { name: 'Account' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Orders' })).toBeInTheDocument();
  });

  it('renders wishlist as disabled text item', () => {
    renderComponent();

    const wishlist = screen.getByText('Wishlist');
    expect(wishlist).toBeInTheDocument();
    expect(wishlist).toHaveAttribute('aria-disabled', 'true');
  });

  it('marks account link as active on /profile route', () => {
    renderComponent(undefined, ['/profile']);

    const accountLink = screen.getByRole('link', { name: 'Account' });
    const ordersLink = screen.getByRole('link', { name: 'Orders' });

    expect(accountLink.className).toContain('text-text');
    expect(accountLink.className).toContain('border-text');

    expect(ordersLink.className).toContain('border-transparent');
    expect(ordersLink.className).toContain('text-muted');
  });

  it('marks orders link as active on /my-orders route', () => {
    renderComponent(undefined, [ROUTES.MYORDERS]);

    const accountLink = screen.getByRole('link', { name: 'Account' });
    const ordersLink = screen.getByRole('link', { name: 'Orders' });

    expect(ordersLink.className).toContain('text-text');
    expect(ordersLink.className).toContain('border-text');

    expect(accountLink.className).toContain('border-transparent');
    expect(accountLink.className).toContain('text-muted');
  });
});
