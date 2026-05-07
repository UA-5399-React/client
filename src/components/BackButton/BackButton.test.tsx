import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BackButton } from './BackButton';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UI Component: BackButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders default label', () => {
    render(<BackButton />);

    expect(screen.getByRole('button', { name: 'Back' })).toBeInTheDocument();
  });

  it('renders custom label', () => {
    render(<BackButton label="Go back" />);

    expect(screen.getByRole('button', { name: 'Go back' })).toBeInTheDocument();
  });

  it('navigates back when clicked', () => {
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });

  it('applies extra className', () => {
    render(<BackButton className="custom-back-btn" />);

    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass(
      'custom-back-btn',
    );
  });
});
