import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { UsersTopWidgets } from './UsersTopWidgets';

describe('UsersTopWidgets', () => {
  it('displays correct numeric values and labels', () => {
    render(
      <UsersTopWidgets totalUsers={150} activeAdmins={15} blockedUsers={7} />,
    );

    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();

    expect(screen.getByText(/total users/i)).toBeInTheDocument();
    expect(screen.getByText(/active admins/i)).toBeInTheDocument();
    expect(screen.getByText(/blocked accounts/i)).toBeInTheDocument();
  });
});
