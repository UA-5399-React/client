import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { AdminUser } from '@/types/admin-user.types';

import { UserAvatar } from './UserAvatar';

describe('UserAvatar', () => {
  const baseUser: AdminUser = {
    id: '1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    role: 'customer',
    isActive: true,
    avatarUrl: '',
    createdAt: '2025-01-01',
    updatedAt: '2025-01-01',
    lastLoginAt: '2025-01-01',
  };

  it('renders user image when avatarUrl exists', () => {
    render(
      <UserAvatar
        user={{
          ...baseUser,
          avatarUrl: 'https://example.com/avatar.jpg',
        }}
      />,
    );

    const image = screen.getByRole('img', { name: 'John Doe' });
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('renders initials when avatarUrl is missing', () => {
    render(<UserAvatar user={baseUser} />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders initials when image loading fails', () => {
    render(
      <UserAvatar
        user={{
          ...baseUser,
          avatarUrl: 'https://example.com/avatar.jpg',
        }}
      />,
    );

    const image = screen.getByRole('img', { name: 'John Doe' });
    fireEvent.error(image);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('renders only available initials when user has one name part', () => {
    render(
      <UserAvatar
        user={{
          ...baseUser,
          firstName: 'John',
          lastName: '',
          avatarUrl: '',
        }}
      />,
    );

    expect(screen.getByText('J')).toBeInTheDocument();
  });
});
