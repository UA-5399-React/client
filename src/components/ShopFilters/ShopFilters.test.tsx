import { MemoryRouter, useLocation } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

const useShopCategoriesMock = vi.fn();

vi.mock('@/hooks/useShopCategories', () => ({
  useShopCategories: () => useShopCategoriesMock(),
}));

vi.mock('@/components/Dropdown', () => ({
  CategoryDropdown: ({
    placeholder,
    disabled,
    onChange,
    options,
    selectedValues,
  }: {
    placeholder: string;
    disabled?: boolean;
    onChange: (values: { label: string; value: string }[]) => void;
    options: { label: string; value: string }[];
    selectedValues?: string[];
  }) => (
    <div>
      <div data-testid="category-placeholder">{placeholder}</div>
      <div data-testid="category-disabled">{String(Boolean(disabled))}</div>
      <div data-testid="category-selected">{selectedValues?.join(',') ?? ''}</div>
      <button type="button" onClick={() => onChange(options.slice(0, 2))}>
        Select categories
      </button>
    </div>
  ),
  Dropdown: () => <div data-testid="price-dropdown" />,
}));

import { ShopFilters } from './ShopFilters';

const LocationDisplay = () => {
  const location = useLocation();

  return <div data-testid="location-search">{location.search}</div>;
};

describe('ShopFilters', () => {
  it('shows a disabled loading state while categories are loading', () => {
    useShopCategoriesMock.mockReturnValue({
      data: [],
      isLoading: true,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/shop']}>
        <ShopFilters />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('category-placeholder')).toHaveTextContent(
      'Loading categories...',
    );
    expect(screen.getByTestId('category-disabled')).toHaveTextContent('true');
  });

  it('writes repeated category params when category selection changes', () => {
    useShopCategoriesMock.mockReturnValue({
      data: [
        { id: 'cat-1', title: 'Phones' },
        { id: 'cat-2', title: 'Tablets' },
      ],
      isLoading: false,
      isError: false,
    });

    render(
      <MemoryRouter initialEntries={['/shop']}>
        <ShopFilters />
        <LocationDisplay />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /select categories/i }));

    const search = screen.getByTestId('location-search').textContent ?? '';

    expect(search).toContain('category=cat-1');
    expect(search).toContain('category=cat-2');
    expect(search).toContain('page=1');
  });
});
