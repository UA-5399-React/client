import type { ButtonHTMLAttributes } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { UserForm } from './UserForm';

vi.mock('../Button', () => ({
  Button: ({ children, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
    <button {...props}>{children}</button>
  ),
}));

describe('UserForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

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

  it('hides password field, keeps email readonly, and shows existing avatar in edit mode', () => {
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
          avatarUrl: 'https://example.com/avatar.jpg',
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
    expect(screen.getByAltText(/user avatar preview/i)).toHaveAttribute(
      'src',
      'https://example.com/avatar.jpg',
    );
  });

  it('renders server error and invokes cancel handler', async () => {
    const onCancel = vi.fn();

    render(
      <UserForm
        mode="create"
        onSubmit={vi.fn()}
        onCancel={onCancel}
        serverError="Something went wrong"
      />,
    );

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');

    await userEvent.click(screen.getByRole('button', { name: /cancel/i }));

    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it('uploads a selected avatar preview and submits the form data', async () => {
    const onSubmit = vi.fn();
    const createObjectURLSpy = vi
      .spyOn(URL, 'createObjectURL')
      .mockReturnValue('blob:preview');

    render(
      <UserForm
        mode="create"
        onSubmit={onSubmit}
        onCancel={vi.fn()}
        serverError={null}
      />,
    );

    const file = new File(['avatar'], 'avatar.png', { type: 'image/png' });
    const fileInput =
      document.querySelector<HTMLInputElement>('input[type="file"]');

    expect(fileInput).not.toBeNull();

    await userEvent.type(screen.getByLabelText(/name/i), 'John Doe');
    await userEvent.type(screen.getByLabelText(/email/i), 'john@example.com');

    if (!fileInput) {
      throw new Error('File input not found');
    }

    await userEvent.upload(fileInput, file);
    await userEvent.click(screen.getByRole('button', { name: /^save$/i }));

    await waitFor(() => {
      expect(onSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER',
          imagePreview: 'blob:preview',
          imageFile: file,
        }),
      );
    });

    expect(createObjectURLSpy).toHaveBeenCalledWith(file);
    expect(screen.getByAltText(/user avatar preview/i)).toHaveAttribute(
      'src',
      'blob:preview',
    );
  }, 10000);
});
