import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Category } from '@/types';
import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { TableCategories } from './TableCategories';

vi.mock('@/hooks/useTheme', () => ({
  useTheme: () => ({ isDark: false }),
}));

const mockDelete = vi.fn();
const mockEdit = vi.fn();

const mockCategories: Category[] = [
  {
    id: 'parent-1',
    title: 'Laptops',
    imageUrl: 'https://example.com/laptops.jpg',
    description: 'Main laptops category',
    parent: null,
    depth: 1,
    createdAt: '2025-10-10T12:00:00Z',
    updatedAt: '2025-10-11T12:00:00Z',
  },
  {
    id: 'child-1',
    title: 'Ultrabooks',
    imageUrl: null,
    description: 'Slim laptops',
    parent: 'parent-1',
    depth: 2,
    createdAt: '2025-10-12T12:00:00Z',
    updatedAt: '2025-10-13T12:00:00Z',
  },
  {
    id: 'parent-2',
    title: 'Accessories',
    imageUrl: null,
    description: 'Category without children',
    parent: null,
    depth: 1,
    createdAt: '2025-10-14T12:00:00Z',
    updatedAt: '2025-10-15T12:00:00Z',
  },
  {
    id: 'orphan-child',
    title: 'Archived',
    imageUrl: null,
    description: 'Missing parent fallback',
    parent: 'missing-parent',
    depth: 2,
    createdAt: '2025-10-16T12:00:00Z',
    updatedAt: '2025-10-17T12:00:00Z',
  },
];

describe('UI Component: TableCategories', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render the table and all column headers', () => {
    render(
      <TableCategories
        items={[]}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Image')).toBeInTheDocument();
    expect(screen.getByText('Category name')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Level')).toBeInTheDocument();
    expect(screen.getByText('Created at')).toBeInTheDocument();
    expect(screen.getByText('Updated at')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('should show loading state', () => {
    render(
      <TableCategories
        items={[]}
        loading={true}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should show error state', () => {
    render(
      <TableCategories
        items={[]}
        loading={false}
        error={new Error('Network failure')}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Failed to load categories')).toBeInTheDocument();
    expect(screen.getByText('Network failure')).toBeInTheDocument();
  });

  it('should show empty state when there are no categories', () => {
    render(
      <TableCategories
        items={[]}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByText('No categories found')).toBeInTheDocument();
  });

  it('should render parent rows and keep subcategories hidden by default', () => {
    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByText('Laptops')).toBeInTheDocument();
    expect(screen.getByText('Accessories')).toBeInTheDocument();
    expect(screen.getByText('Archived')).toBeInTheDocument();
    expect(screen.queryByText('Ultrabooks')).not.toBeInTheDocument();
  });

  it('should expand and collapse subcategories on toggle click', async () => {
    const user = userEvent.setup();

    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    const toggleButton = screen.getByRole('button', { name: 'Expand Laptops' });
    await user.click(toggleButton);

    expect(screen.getByText('Ultrabooks')).toBeInTheDocument();
    expect(screen.getByText('Slim laptops')).toBeInTheDocument();
    expect(screen.getAllByText('Subcategory').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Collapse Laptops' }));

    expect(screen.queryByText('Ultrabooks')).not.toBeInTheDocument();
  });

  it('should auto-expand parent categories passed from search results', () => {
    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        autoExpandedIds={['parent-1']}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getByText('Ultrabooks')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Collapse Laptops' }),
    ).toBeInTheDocument();
  });

  it('should render image fallback and action menu actions', async () => {
    const user = userEvent.setup();

    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getAllByText('N/A').length).toBeGreaterThan(0);

    await user.click(
      screen.getByRole('button', { name: 'Actions for Accessories' }),
    );

    expect(
      await screen.findByRole('button', { name: /^edit$/i }),
    ).toBeInTheDocument();
    expect(
      await screen.findByRole('button', { name: /^delete$/i }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^edit$/i }));

    await waitFor(() => {
      expect(mockEdit).toHaveBeenCalledWith(mockCategories[2]);
    });

    await user.click(
      screen.getByRole('button', { name: 'Actions for Accessories' }),
    );
    await user.click(screen.getByRole('button', { name: /^delete$/i }));

    await waitFor(() => {
      expect(mockDelete).toHaveBeenCalledWith(mockCategories[2]);
    });

    await user.click(
      screen.getByRole('button', { name: 'Actions for Laptops' }),
    );

    expect(screen.getByRole('button', { name: /^delete$/i })).toBeDisabled();
  });

  it('should disable delete button for currently deleting category', async () => {
    const user = userEvent.setup();

    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        deletingId="parent-2"
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    await user.click(
      screen.getByRole('button', { name: 'Actions for Accessories' }),
    );

    expect(screen.getByRole('button', { name: /^delete$/i })).toBeDisabled();
  });

  it('should render formatted dates and parent category label', () => {
    render(
      <TableCategories
        items={mockCategories}
        loading={false}
        onDelete={mockDelete}
        onEdit={mockEdit}
      />,
    );

    expect(screen.getAllByText('Parent category').length).toBeGreaterThan(0);
    expect(screen.getByText('10/10/25')).toBeInTheDocument();
    expect(screen.getByText('10/11/25')).toBeInTheDocument();
  });
});
