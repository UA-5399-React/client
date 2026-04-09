import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, type Mock, vi } from 'vitest';

import { NEW_ARRIVALS_LIMIT } from '@/constants';
import { apiClient } from '@/services/api';

import { FeaturedProducts } from './FeaturedProducts';

vi.mock('@/services/api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockProducts = {
  items: [
    { _id: 'prod-1', title: 'iPhone 15', price: 1000 },
    { _id: 'prod-2', title: 'MacBook Pro', price: 2000 },
  ],
};

const mockFeatured = [
  {
    productId: { _id: 'prod-3', title: 'AirPods', price: 200 },
    type: 'new_arrival',
    position: 0,
  },
];

describe('Page: FeaturedProducts', () => {
  const renderPage = () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });

    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/admin/featured']}>
          <Routes>
            <Route path="/admin/featured" element={<FeaturedProducts />} />
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

  it('renders the page with loaded data and correct counter', async () => {
    renderPage();
    expect(await screen.findByText('Manage New Arrivals')).toBeInTheDocument();
    expect(screen.getByText('AirPods')).toBeInTheDocument();
    expect(
      screen.getByText(`1 / ${NEW_ARRIVALS_LIMIT} Items`),
    ).toBeInTheDocument();
  });

  it('filters and adds a product from search results', async () => {
    renderPage();
    await screen.findByText('Manage New Arrivals');

    const searchInput = screen.getByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });

    const dropDownItem = await screen.findByText('iPhone 15');
    fireEvent.click(dropDownItem);

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        '/featured-products',
        expect.objectContaining({ productId: 'prod-1', type: 'new_arrival' }),
      );
    });
  });

  it('removes a product from the list when trash icon is clicked', async () => {
    (apiClient.delete as Mock).mockResolvedValue({});
    renderPage();

    await screen.findByText('AirPods');
    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith(
        expect.stringContaining('prod-3'),
      );
      expect(screen.queryByText('AirPods')).not.toBeInTheDocument();
    });
  });

  it('handles fetch error in useEffect', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.get as Mock).mockRejectedValue(new Error('Fetch failed'));

    renderPage();

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Fetch error:',
        expect.any(Error),
      );
    });
    consoleSpy.mockRestore();
  });

  it('handles error during product addition', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.post as Mock).mockRejectedValue(new Error('Add failed'));
    renderPage();

    const searchInput = await screen.findByRole('textbox');
    fireEvent.change(searchInput, { target: { value: 'iPhone' } });
    const dropDownItem = await screen.findByText('iPhone 15');
    fireEvent.click(dropDownItem);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Add error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  it('handles error during product removal', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (apiClient.delete as Mock).mockRejectedValue(new Error('Delete failed'));
    renderPage();

    await screen.findByText('AirPods');
    const deleteButton = screen.getByRole('button', { name: '' });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Remove error:',
        expect.any(Error),
      );
    });
    consoleSpy.mockRestore();
  });

  it('prevents adding product if limit is reached (logic check)', async () => {
    const fullList = Array(NEW_ARRIVALS_LIMIT)
      .fill(0)
      .map((_, i) => ({
        productId: { _id: `id-${i}`, title: `Product ${i}`, price: 100 },
        type: 'new_arrival',
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

    expect(apiClient.post).not.toHaveBeenCalled();
  });
});
