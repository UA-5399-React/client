import { MemoryRouter } from 'react-router-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { NEW_ARRIVALS_LIMIT, ROUTES } from '@/constants';
import { apiClient } from '@/services/api';

import { FeaturedProducts } from './FeaturedProducts';

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@dnd-kit/core', () => ({
  DndContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd?: (event: unknown) => void;
  }) => (
    <div>
      {children}
      <button
        type="button"
        onClick={() =>
          onDragEnd?.({ active: { id: 'prod-1' }, over: { id: 'prod-2' } })
        }
      >
        Trigger reorder
      </button>
      <button
        type="button"
        onClick={() => onDragEnd?.({ active: { id: 'prod-1' }, over: null })}
      >
        Trigger invalid reorder
      </button>
    </div>
  ),
  closestCenter: vi.fn(),
}));

vi.mock('@dnd-kit/sortable', () => ({
  arrayMove: <T,>(arr: T[], from: number, to: number) => {
    const clone = [...arr];
    const [item] = clone.splice(from, 1);
    clone.splice(to, 0, item);
    return clone;
  },
  SortableContext: ({ children }: { children: React.ReactNode }) => children,
  useSortable: () => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: null,
    transition: undefined,
    isDragging: false,
  }),
  verticalListSortingStrategy: {},
}));

vi.mock('@dnd-kit/utilities', () => ({
  CSS: {
    Transform: { toString: () => '' },
  },
}));

vi.mock('@/components', () => ({
  AdminPageHeader: () => <div>Admin header</div>,
  SearchInput: ({
    value,
    onChange,
    disabled,
  }: {
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
  }) => (
    <input
      aria-label="Search"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
    />
  ),
  ActionMenu: ({
    triggerAriaLabel,
    actions,
  }: {
    triggerAriaLabel: string;
    actions: Array<{ id: string; label: string; onClick: () => void }>;
  }) => (
    <div>
      <button aria-label={triggerAriaLabel} type="button">
        Actions
      </button>
      {actions.map((a) => (
        <button key={a.id} type="button" onClick={a.onClick}>
          {a.label}
        </button>
      ))}
    </div>
  ),
}));

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
    patch: vi.fn(),
  },
}));

const mockProducts = {
  items: [
    { _id: 'prod-1', title: 'iPhone 15', price: 1000, imageUrl: 'test.jpg' },
    { _id: 'prod-2', title: 'MacBook Pro', price: 2000, imageUrl: 'test.jpg' },
    { _id: 'prod-4', title: 'No Image', price: 1500, imageUrl: '' },
  ],
};

const mockFeaturedSingle = [
  {
    productId: {
      _id: 'prod-3',
      title: 'AirPods',
      price: 200,
      imageUrl: 'test.jpg',
    },
    type: 'new_arrival',
    position: 0,
  },
];

const mockFeaturedReorder = [
  {
    productId: {
      _id: 'prod-1',
      title: 'iPhone 15',
      price: 1000,
      imageUrl: 'test.jpg',
    },
    type: 'new_arrival',
    position: 0,
  },
  {
    productId: {
      _id: 'prod-2',
      title: 'MacBook Pro',
      price: 2000,
      imageUrl: 'test.jpg',
    },
    type: 'new_arrival',
    position: 1,
  },
];

describe('Page: FeaturedProducts', () => {
  const user = userEvent.setup();

  const renderPage = () => {
    return render(
      <MemoryRouter initialEntries={[ROUTES.ADMIN_FEATURED]}>
        <FeaturedProducts />
      </MemoryRouter>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products'))
        return Promise.resolve(mockFeaturedSingle);
      return Promise.resolve([]);
    });
  });

  it('shows loading state while data is being fetched', async () => {
    let resolveProducts!: () => void;
    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) {
        return new Promise<void>((resolve) => {
          resolveProducts = resolve;
        });
      }
      return Promise.resolve(mockFeaturedSingle);
    });

    renderPage();

    expect(document.querySelector('.animate-spin')).toBeInTheDocument();

    resolveProducts();
    await screen.findByText('Manage New Arrivals');
  });

  it('adds a product from search results and confirms action', async () => {
    (apiClient.post as Mock).mockResolvedValue({});

    renderPage();

    const searchInput = await screen.findByRole('textbox');
    await user.type(searchInput, 'iPhone');

    const productText = await screen.findByText('iPhone 15');

    const addButton =
      productText.parentElement?.parentElement?.querySelector('button');

    expect(addButton).toBeTruthy();

    await user.click(addButton!);

    const confirmBtn = await screen.findByText('Confirm');
    await user.click(confirmBtn);

    await waitFor(() =>
      expect(apiClient.post).toHaveBeenCalledWith('/featured-products', {
        productId: 'prod-1',
        type: 'new_arrival',
        position: 0,
      }),
    );
  });

  it('navigates to product edit page from featured item', async () => {
    renderPage();

    await screen.findByText('AirPods');

    const menuTrigger = screen.getByLabelText(/actions for airpods/i);
    await user.click(menuTrigger);

    const editButton = screen.getByText(/^edit$/i);
    await user.click(editButton);
    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('prod-3'),
    );
  });

  it('removes a product from the list', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ success: true });

    renderPage();

    await screen.findByText('AirPods');

    const menuTrigger = screen.getByLabelText(/actions for airpods/i);
    await user.click(menuTrigger);

    const deleteBtn = screen.getByText(/delete/i);
    await user.click(deleteBtn);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('prod-3'),
      );
    });
  });

  it('handles fetch error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.get as Mock).mockRejectedValue(new Error('Fetch failed'));

    renderPage();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  it('handles add error and logs it', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.post as Mock).mockRejectedValue(new Error('Add failed'));

    renderPage();

    const searchInput = await screen.findByRole('textbox');
    await user.type(searchInput, 'iPhone');

    const productText = await screen.findByText('iPhone 15');

    const addButton =
      productText.parentElement?.parentElement?.querySelector('button');

    await user.click(addButton!);

    const confirmBtn = await screen.findByText('Confirm');
    await user.click(confirmBtn);

    await waitFor(() => {
      const call = consoleSpy.mock.calls[0];
      expect(call[0]).toContain('Add error');
      expect(call[1]).toBeInstanceOf(Error);
    });

    consoleSpy.mockRestore();
  });

  it('shows empty list state when no featured products', async () => {
    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products')) return Promise.resolve([]);
      return Promise.resolve([]);
    });

    renderPage();

    expect(await screen.findByText(/The list is empty/i)).toBeInTheDocument();
  });

  it('shows no search results message', async () => {
    renderPage();

    const searchInput = await screen.findByRole('textbox', { name: 'Search' });
    await user.type(searchInput, 'Unknown Product');

    expect(
      await screen.findByText('No active products found'),
    ).toBeInTheDocument();
  });

  it('handles reorder success through drag end', async () => {
    (apiClient.patch as Mock).mockResolvedValue({});
    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products'))
        return Promise.resolve(mockFeaturedReorder);
      return Promise.resolve([]);
    });

    renderPage();
    await screen.findByText('iPhone 15');

    await user.click(screen.getByRole('button', { name: 'Trigger reorder' }));

    await waitFor(() =>
      expect(apiClient.patch).toHaveBeenCalledWith(
        '/featured-products/reorder',
        [
          { productId: 'prod-2', position: 0 },
          { productId: 'prod-1', position: 1 },
        ],
      ),
    );
  });

  it('handles reorder error and refetches featured list', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products'))
        return Promise.resolve(mockFeaturedReorder);
      return Promise.resolve([]);
    });
    vi.mocked(apiClient.patch).mockRejectedValue(new Error('Reorder failed'));

    renderPage();
    await screen.findByText('iPhone 15');
    const initialFeaturedCalls = (apiClient.get as Mock).mock.calls.filter(
      ([url]) => String(url).includes('/featured-products'),
    ).length;

    await user.click(screen.getByRole('button', { name: 'Trigger reorder' }));

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save order:',
        expect.any(Error),
      );
    });
    const nextFeaturedCalls = (apiClient.get as Mock).mock.calls.filter(
      ([url]) => String(url).includes('/featured-products'),
    ).length;
    expect(nextFeaturedCalls).toBeGreaterThan(initialFeaturedCalls);

    consoleSpy.mockRestore();
  });

  it('disables search when limit reached', async () => {
    const fullList = Array(NEW_ARRIVALS_LIMIT)
      .fill(0)
      .map((_, i) => ({
        productId: {
          _id: `id-${i}`,
          title: `Product ${i}`,
          price: 100,
          imageUrl: 'test.jpg',
        },
        type: 'new_arrival',
        position: i,
      }));

    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products')) return Promise.resolve(fullList);
      return Promise.resolve([]);
    });

    renderPage();

    const searchInput = await screen.findByRole('textbox');

    await waitFor(() => {
      expect(searchInput).toBeDisabled();
    });
  });

  it('renders page with data', async () => {
    renderPage();

    expect(await screen.findByText('Manage New Arrivals')).toBeInTheDocument();
    expect(screen.getByText('AirPods')).toBeInTheDocument();

    const image = screen.getByAltText('AirPods');
    expect(image).toHaveAttribute('src', 'test.jpg');

    expect(
      screen.getByText(`1 / ${NEW_ARRIVALS_LIMIT} Items`),
    ).toBeInTheDocument();
  });

  it('does not call patch when drag end has no target', async () => {
    (apiClient.patch as Mock).mockResolvedValue({});
    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products'))
        return Promise.resolve(mockFeaturedReorder);
      return Promise.resolve([]);
    });

    renderPage();
    await screen.findByText('iPhone 15');
    await user.click(
      screen.getByRole('button', { name: 'Trigger invalid reorder' }),
    );

    expect(apiClient.patch).not.toHaveBeenCalled();
  });
});
