import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Switcher } from './Switcher';

describe('UI Component: Switcher', () => {
  it('should render labels and switch in inactive state', () => {
    render(
      <Switcher
        isRightActive={false}
        leftLabel="Count"
        rightLabel="Revenue"
        onToggle={vi.fn()}
      />,
    );

    const switchElement = screen.getByRole('switch', { name: 'Toggle values' });

    expect(screen.getByText('Count')).toBeInTheDocument();
    expect(screen.getByText('Revenue')).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    expect(switchElement).toHaveClass('bg-gray-300');
    expect(screen.getByText('Count')).toHaveClass('font-semibold');
    expect(screen.getByText('Revenue')).not.toHaveClass('font-semibold');
  });

  it('should render active state classes when right side is active', () => {
    render(
      <Switcher
        isRightActive
        leftLabel="Count"
        rightLabel="Revenue"
        onToggle={vi.fn()}
      />,
    );

    const switchElement = screen.getByRole('switch', { name: 'Toggle values' });

    expect(switchElement).toHaveAttribute('aria-checked', 'true');
    expect(switchElement).toHaveClass('bg-blue-500');
    expect(screen.getByText('Revenue')).toHaveClass('font-semibold');
    expect(screen.getByText('Count')).not.toHaveClass('font-semibold');
  });

  it('should call onToggle when switch is clicked', async () => {
    const user = userEvent.setup();
    const handleToggle = vi.fn();

    render(
      <Switcher
        isRightActive={false}
        leftLabel="Count"
        rightLabel="Revenue"
        onToggle={handleToggle}
      />,
    );

    await user.click(screen.getByRole('switch', { name: 'Toggle values' }));

    expect(handleToggle).toHaveBeenCalledOnce();
  });

  it('should support custom aria label', () => {
    render(
      <Switcher
        isRightActive={false}
        leftLabel="Count"
        rightLabel="Revenue"
        onToggle={vi.fn()}
        ariaLabel="ABC metric switch"
      />,
    );

    expect(
      screen.getByRole('switch', { name: 'ABC metric switch' }),
    ).toBeInTheDocument();
  });
});
