import { describe, expect, it, vi } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { UserForm } from './UserForm';

describe('UserForm', () => {
  it('renders password field in create mode', () => {
    render(
      <UserForm
        mode="create"
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        serverError={null}
      />,
    );

    expect(screen.getByPlaceholderText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).not.toHaveAttribute('readonly');
  });

  it('hides password field and makes email readonly in edit mode', () => {
    render(
      <UserForm
        mode="edit"
        initialData={{
          id: 'user-1',
          firstName: 'Jane',
          lastName: 'Doe',
          email: 'jane@example.com',
          role: 'ADMIN',
          isActive: true,
          isEmailConfirmed: true,
          createdAt: '2026-03-20T10:00:00.000Z',
          updatedAt: '2026-03-20T10:00:00.000Z',
        }}
        onSubmit={vi.fn()}
        onCancel={vi.fn()}
        serverError={null}
      />,
    );

    expect(screen.queryByLabelText(/password/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toHaveAttribute('readonly');
  });
});
