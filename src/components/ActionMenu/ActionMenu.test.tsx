import type { HTMLAttributes } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as LucideIcons from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ActionMenu } from './ActionMenu';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof LucideIcons>();
  return {
    ...actual,
    EllipsisVertical: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="ellipsis-icon" {...props} />
    ),
    Pencil: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="pencil-icon" {...props} />
    ),
    Trash: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="trash-icon" {...props} />
    ),
  };
});

function getTriggerButton() {
  const buttons = screen.getAllByRole('button');
  return buttons[0];
}

describe('ActionMenu', () => {
  it('shows only the trigger initially; Edit is not visible', () => {
    const editAction = vi.fn();
    render(<ActionMenu editAction={editAction} />);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it('opens the panel on trigger click and shows Edit', async () => {
    const user = userEvent.setup();
    const editAction = vi.fn();
    render(<ActionMenu editAction={editAction} />);

    await user.click(getTriggerButton());

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls editAction and closes the panel when Edit is clicked', async () => {
    const user = userEvent.setup();
    const editAction = vi.fn();
    render(<ActionMenu editAction={editAction} />);

    await user.click(getTriggerButton());
    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(editAction).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it('renders Delete when deleteAction is provided', async () => {
    const user = userEvent.setup();
    const deleteAction = vi.fn();
    render(<ActionMenu editAction={vi.fn()} deleteAction={deleteAction} />);

    await user.click(getTriggerButton());

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not render Delete when deleteAction is omitted', async () => {
    const user = userEvent.setup();
    render(<ActionMenu editAction={vi.fn()} />);

    await user.click(getTriggerButton());

    expect(
      screen.queryByRole('button', { name: /delete/i }),
    ).not.toBeInTheDocument();
  });

  it('calls deleteAction when Delete is clicked', async () => {
    const user = userEvent.setup();
    const deleteAction = vi.fn();
    render(<ActionMenu editAction={vi.fn()} deleteAction={deleteAction} />);

    await user.click(getTriggerButton());
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(deleteAction).toHaveBeenCalledTimes(1);
  });

  it('closes the panel on pointerdown outside the menu', async () => {
    const user = userEvent.setup();
    render(<ActionMenu editAction={vi.fn()} deleteAction={vi.fn()} />);

    await user.click(getTriggerButton());
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });
});
