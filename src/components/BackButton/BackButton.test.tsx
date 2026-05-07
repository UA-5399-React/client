import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { BackButton } from './BackButton';

const mocks = vi.hoisted(() => ({
  navigate: vi.fn(),
}));

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
    useNavigate: () => mocks.navigate,
  };
});

describe('BackButton', () => {
  it('navigates back one step when clicked', () => {
    render(<BackButton />);

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));

    expect(mocks.navigate).toHaveBeenCalledTimes(1);
    expect(mocks.navigate).toHaveBeenCalledWith(-1);
  });

  it('renders custom label', () => {
    render(<BackButton label="Return to list" />);

    expect(
      screen.getByRole('button', { name: 'Return to list' }),
    ).toBeInTheDocument();
  });

  it('merges optional className onto the button', () => {
    render(<BackButton className="extra-class" />);

    expect(screen.getByRole('button', { name: 'Back' })).toHaveClass(
      'extra-class',
    );
  });
});
