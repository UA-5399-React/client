import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { NewsletterSubscriber } from '@/types/newsletterSubscriber.types';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { TableSubscribers } from './TableSubscriptions';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

const onDeleteMock = vi.fn();

const subscribers: NewsletterSubscriber[] = [
  { email: 'active@example.com', isActive: true },
  { email: 'inactive@example.com', isActive: false },
  { email: 'second-active@example.com', isActive: true },
];

describe('UI Component: TableSubscriptions', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render loading state', () => {
    render(
      <TableSubscribers
        items={[]}
        loading={true}
        error={null}
        onDelete={onDeleteMock}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should render error state', () => {
    render(
      <TableSubscribers
        items={[]}
        loading={false}
        error={new Error('Request failed')}
        onDelete={onDeleteMock}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load subscribers')).toBeInTheDocument();
    expect(screen.getByText('Request failed')).toBeInTheDocument();
  });

  it('should render empty state', () => {
    render(
      <TableSubscribers
        items={[]}
        loading={false}
        error={null}
        onDelete={onDeleteMock}
      />,
    );

    expect(screen.getByText('No subscribers found')).toBeInTheDocument();
  });

  it('should filter subscribers by tabs', async () => {
    const user = userEvent.setup();

    render(
      <TableSubscribers
        items={subscribers}
        loading={false}
        error={null}
        onDelete={onDeleteMock}
      />,
    );

    expect(screen.getByText('active@example.com')).toBeInTheDocument();
    expect(screen.getByText('inactive@example.com')).toBeInTheDocument();
    expect(screen.getByText('second-active@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Active' }));

    expect(screen.getByText('active@example.com')).toBeInTheDocument();
    expect(screen.queryByText('inactive@example.com')).not.toBeInTheDocument();
    expect(screen.getByText('second-active@example.com')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Inactive' }));

    expect(screen.queryByText('active@example.com')).not.toBeInTheDocument();
    expect(screen.getByText('inactive@example.com')).toBeInTheDocument();
    expect(
      screen.queryByText('second-active@example.com'),
    ).not.toBeInTheDocument();
  });

  it('should select all filtered rows and show selected counter', async () => {
    const user = userEvent.setup();

    render(
      <TableSubscribers
        items={subscribers}
        loading={false}
        error={null}
        onDelete={onDeleteMock}
      />,
    );

    await user.click(screen.getByRole('button', { name: 'Active' }));
    await user.click(screen.getAllByRole('checkbox')[0]);

    expect(
      screen.getByRole('button', { name: 'Unsubscribe selected (2)' }),
    ).toBeInTheDocument();
  });

  it('should confirm unsubscribe and call onDelete for each selected user', async () => {
    const user = userEvent.setup();

    render(
      <TableSubscribers
        items={subscribers}
        loading={false}
        error={null}
        onDelete={onDeleteMock}
      />,
    );

    await user.click(screen.getAllByRole('checkbox')[1]);
    await user.click(screen.getAllByRole('checkbox')[2]);

    await user.click(
      screen.getByRole('button', { name: 'Unsubscribe selected (2)' }),
    );

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Unsubscribe users')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Unsubscribe' }));

    await waitFor(() => {
      expect(onDeleteMock).toHaveBeenCalledTimes(2);
    });

    expect(onDeleteMock).toHaveBeenCalledWith('active@example.com');
    expect(onDeleteMock).toHaveBeenCalledWith('inactive@example.com');
    expect(
      screen.getByRole('button', { name: 'Unsubscribe selected (0)' }),
    ).toBeDisabled();
  });
});
