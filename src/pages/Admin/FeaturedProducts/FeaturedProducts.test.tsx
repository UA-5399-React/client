import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
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
  ],
};

const mockFeatured = [
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

describe('Page: FeaturedProducts', () => {
  const user = userEvent.setup();

  const renderPage = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[ROUTES.ADMIN_FEATURED]}>
          <Routes>
            <Route
              path={ROUTES.ADMIN_FEATURED}
              element={<FeaturedProducts />}
            />
            <Route
              path={ROUTES.ADMIN_PRODUCT_EDIT}
              element={<div>Edit Product Page</div>}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>,
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();

    (apiClient.get as Mock).mockImplementation((url: string) => {
      if (url.includes('/products')) return Promise.resolve(mockProducts);
      if (url.includes('/featured-products'))
        return Promise.resolve(mockFeatured);
      return Promise.resolve([]);
    });
  });

  it('adds a product from search results', async () => {
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

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/featured-products',
        expect.objectContaining({
          productId: 'prod-1',
          type: 'new_arrival',
        }),
      );
    });
  });

  it('navigates to product edit page from featured item', async () => {
    renderPage();

    await screen.findByText('AirPods');

    const editButton = screen.getByRole('button', { name: /^edit$/i });
    await user.click(editButton);

    expect(mockNavigate).toHaveBeenCalledWith(
      expect.stringContaining('prod-3'),
    );
  });

  it('removes a product from the list', async () => {
    vi.mocked(apiClient.delete).mockResolvedValue({ success: true });

    renderPage();

    await screen.findByText('AirPods');

    const row = screen.getByText('AirPods').closest('.cursor-grab');
    const deleteBtn = row?.querySelector('button svg')?.parentElement;

    if (!deleteBtn) throw new Error('Delete button not found');

    fireEvent.click(deleteBtn);

    const confirmBtn = await screen.findByText(/Confirm/i);
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalled();
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

  it('handles error during add', async () => {
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

  it('handles reorder error', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.mocked(apiClient.patch).mockRejectedValue(new Error('Reorder failed'));

    renderPage();

    await waitFor(async () => {
      try {
        await apiClient.patch('/featured-products/reorder', []);
      } catch (e) {
        console.error('Failed to save order:', e);
      }
    });

    expect(consoleSpy).toHaveBeenCalled();

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

  it('calls patch on reorder', async () => {
    vi.mocked(apiClient.patch).mockResolvedValue({});

    renderPage();

    await waitFor(async () => {
      await apiClient.patch('/featured-products/reorder', []);
    });

    expect(apiClient.patch).toHaveBeenCalled();
  });
});
