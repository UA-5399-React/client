import type { HTMLAttributes } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type * as LucideIcons from 'lucide-react';
import { describe, expect, it, vi } from 'vitest';

import { ActionMenu, type ActionMenuItem } from './ActionMenu';

vi.mock('lucide-react', async (importOriginal) => {
  const actual = await importOriginal<typeof LucideIcons>();
  return {
    ...actual,
    EllipsisVertical: (props: HTMLAttributes<HTMLDivElement>) => (
      <div data-testid="ellipsis-icon" {...props} />
    ),
  };
});

function createAction(overrides: Partial<ActionMenuItem> = {}): ActionMenuItem {
  const { id = 'edit', ...rest } = overrides;

  return {
    id,
    label: 'Edit',
    onClick: vi.fn(),
    icon: <span data-testid="action-icon" />,
    ...rest,
  };
}

function renderActionMenu(actions: ActionMenuItem[]) {
  render(<ActionMenu triggerAriaLabel="Open actions menu" actions={actions} />);
}

function getTriggerButton() {
  return screen.getByRole('button', { name: /open actions menu/i });
}

describe('ActionMenu', () => {
  it('does not render anything when actions are empty', () => {
    renderActionMenu([]);

    expect(
      screen.queryByRole('button', { name: /open actions menu/i }),
    ).not.toBeInTheDocument();
  });

  it('shows only the trigger initially; actions are not visible', () => {
    renderActionMenu([createAction({ id: 'edit', label: 'Edit' })]);

    expect(screen.getAllByRole('button')).toHaveLength(1);
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it('opens the panel on trigger click and shows actions', async () => {
    const user = userEvent.setup();

    renderActionMenu([createAction({ id: 'edit', label: 'Edit' })]);

    await user.click(getTriggerButton());

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls action.onClick and closes the panel when an action is clicked', async () => {
    const user = userEvent.setup();
    const editAction = vi.fn();

    renderActionMenu([
      createAction({
        id: 'edit',
        label: 'Edit',
        onClick: editAction,
      }),
    ]);

    await user.click(getTriggerButton());
    await user.click(screen.getByRole('button', { name: /edit/i }));

    expect(editAction).toHaveBeenCalledTimes(1);
    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });

  it('renders multiple actions when they are provided', async () => {
    const user = userEvent.setup();

    renderActionMenu([
      createAction({ id: 'edit', label: 'Edit' }),
      createAction({
        id: 'delete',
        label: 'Delete',
        icon: <span data-testid="delete-icon" />,
        onClick: vi.fn(),
        variant: 'danger',
      }),
    ]);

    await user.click(getTriggerButton());

    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });

  it('does not call onClick for a disabled action', async () => {
    const user = userEvent.setup();
    const deleteAction = vi.fn();

    renderActionMenu([
      createAction({
        id: 'delete',
        label: 'Delete',
        icon: <span data-testid="delete-icon" />,
        onClick: deleteAction,
        disabled: true,
      }),
    ]);

    await user.click(getTriggerButton());
    await user.click(screen.getByRole('button', { name: /delete/i }));

    expect(deleteAction).not.toHaveBeenCalled();
  });

  it('renders separators between actions', async () => {
    const user = userEvent.setup();

    renderActionMenu([
      createAction({ id: 'edit', label: 'Edit' }),
      createAction({
        id: 'duplicate',
        label: 'Duplicate',
        icon: <span data-testid="duplicate-icon" />,
        onClick: vi.fn(),
      }),
      createAction({
        id: 'delete',
        label: 'Delete',
        icon: <span data-testid="delete-icon" />,
        onClick: vi.fn(),
        variant: 'danger',
      }),
    ]);

    await user.click(getTriggerButton());

    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });

  it('closes the panel on pointerdown outside the menu', async () => {
    const user = userEvent.setup();

    renderActionMenu([
      createAction({ id: 'edit', label: 'Edit' }),
      createAction({
        id: 'delete',
        label: 'Delete',
        icon: <span data-testid="delete-icon" />,
        onClick: vi.fn(),
        variant: 'danger',
      }),
    ]);

    await user.click(getTriggerButton());
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();

    fireEvent.pointerDown(document.body);

    expect(
      screen.queryByRole('button', { name: /edit/i }),
    ).not.toBeInTheDocument();
  });
});
