import { ArrowUp } from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { SortOrderButton } from './SortOrderButton';

describe('UI Component: SortOrderButton', () => {
  it('should render label text', () => {
    const onClick = vi.fn();

    render(
      <SortOrderButton
        active={false}
        icon={<ArrowUp size={20} />}
        label="Ascending"
        onClick={onClick}
      />,
    );

    expect(
      screen.getByRole('button', { name: /ascending/i }),
    ).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <SortOrderButton
        active={false}
        icon={<ArrowUp size={20} />}
        label="Ascending"
        onClick={onClick}
      />,
    );

    await user.click(screen.getByRole('button', { name: /ascending/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should apply active classes when active is true', () => {
    const onClick = vi.fn();

    render(
      <SortOrderButton
        active
        icon={<ArrowUp size={20} />}
        label="Ascending"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: /ascending/i });

    expect(button).toHaveClass(
      'border',
      'border-blue-500',
      'bg-blue-50',
      'text-blue-600',
    );
  });

  it('should apply inactive classes when active is false', () => {
    const onClick = vi.fn();

    render(
      <SortOrderButton
        active={false}
        icon={<ArrowUp size={20} />}
        label="Ascending"
        onClick={onClick}
      />,
    );

    const button = screen.getByRole('button', { name: /ascending/i });

    expect(button).toHaveClass(
      'border-none',
      'bg-transparent',
      'text-gray-800',
      'hover:bg-gray-50',
    );
  });
});
