import { fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ProductsFilters } from '@/types/filters';
import { render, screen, userEvent } from '@/utils/test-utils';

import { ProductFiltersBar } from './ProductsFiltersBar';

vi.mock('@/hooks/useAdminCategories', () => ({
  useAdminCategories: () => ({
    categories: [
      { id: '1', title: 'Laptop' },
      { id: '2', title: 'Audio' },
    ],
    loading: false,
    error: undefined,
  }),
}));

const defaultFilters: ProductsFilters = {
  categories: [],
  minPrice: '',
  maxPrice: '',
  status: '',
  dateFrom: '',
  dateTo: '',
  dateField: 'createdAt' as ProductsFilters['dateField'],
};

describe('UI Component: ProductFiltersBar', () => {
  it('should render the Category dropdown', () => {
    render(<ProductFiltersBar filters={defaultFilters} onChange={vi.fn()} />);
    expect(screen.getByText('Category')).toBeInTheDocument();
  });

  it('should render the Price inputs with Min and Max placeholders', () => {
    render(<ProductFiltersBar filters={defaultFilters} onChange={vi.fn()} />);
    expect(screen.getByPlaceholderText('Min')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Max')).toBeInTheDocument();
  });

  it('should render all three status checkboxes', () => {
    render(<ProductFiltersBar filters={defaultFilters} onChange={vi.fn()} />);
    expect(
      screen.getAllByRole('checkbox', { name: /Active/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('checkbox', { name: /Inactive/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('checkbox', { name: /Draft/i })[0],
    ).toBeInTheDocument();
  });

  it('should render From and To date inputs', () => {
    render(<ProductFiltersBar filters={defaultFilters} onChange={vi.fn()} />);
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
  });

  it('should render Created and Updated date field checkboxes', () => {
    render(<ProductFiltersBar filters={defaultFilters} onChange={vi.fn()} />);
    expect(
      screen.getAllByRole('checkbox', { name: /Created/i })[0],
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole('checkbox', { name: /Updated/i })[0],
    ).toBeInTheDocument();
  });

  it('should call onChange with updated minPrice when Min input changes', () => {
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Min'), {
      target: { value: '10' },
    });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      minPrice: '10',
    });
  });

  it('should call onChange with updated maxPrice when Max input changes', () => {
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Max'), {
      target: { value: '999' },
    });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      maxPrice: '999',
    });
  });

  it('should display current minPrice and maxPrice values', () => {
    render(
      <ProductFiltersBar
        filters={{ ...defaultFilters, minPrice: '5', maxPrice: '500' }}
        onChange={vi.fn()}
      />,
    );
    expect(screen.getByPlaceholderText('Min')).toHaveValue(5);
    expect(screen.getByPlaceholderText('Max')).toHaveValue(500);
  });

  it('should check the Active checkbox when status is ACTIVE', () => {
    render(
      <ProductFiltersBar
        filters={{ ...defaultFilters, status: 'ACTIVE' }}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getAllByRole('checkbox', { name: /Active/i })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /Inactive/i })[0],
    ).not.toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /Draft/i })[0],
    ).not.toBeChecked();
  });

  it('should call onChange with status ACTIVE when Active is checked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: /Active/i })[0]);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: 'ACTIVE',
    });
  });

  it('should call onChange with status INACTIVE when Inactive is checked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: /Inactive/i })[0]);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: 'INACTIVE',
    });
  });

  it('should call onChange with empty status when already checked status is unchecked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar
        filters={{ ...defaultFilters, status: 'ACTIVE' }}
        onChange={handleChange}
      />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: /Active/i })[0]);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      status: '',
    });
  });

  it('should call onChange with updated dateFrom when From input changes', () => {
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByLabelText('From'), {
      target: { value: '2024-01-01' },
    });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      dateFrom: '2024-01-01',
    });
  });

  it('should call onChange with updated dateTo when To input changes', () => {
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    fireEvent.change(screen.getByLabelText('To'), {
      target: { value: '2024-12-31' },
    });

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      dateTo: '2024-12-31',
    });
  });

  it('should check Created checkbox when dateField is createdAt', () => {
    render(
      <ProductFiltersBar
        filters={{ ...defaultFilters, dateField: 'createdAt' }}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getAllByRole('checkbox', { name: /Created/i })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /Updated/i })[0],
    ).not.toBeChecked();
  });

  it('should check Updated checkbox when dateField is updatedAt', () => {
    render(
      <ProductFiltersBar
        filters={{ ...defaultFilters, dateField: 'updatedAt' }}
        onChange={vi.fn()}
      />,
    );
    expect(
      screen.getAllByRole('checkbox', { name: /Updated/i })[0],
    ).toBeChecked();
    expect(
      screen.getAllByRole('checkbox', { name: /Created/i })[0],
    ).not.toBeChecked();
  });

  it('should call onChange with dateField createdAt when Created is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: /Created/i })[0]);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      dateField: 'createdAt',
    });
  });

  it('should call onChange with dateField updatedAt when Updated is clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();
    render(
      <ProductFiltersBar filters={defaultFilters} onChange={handleChange} />,
    );

    await user.click(screen.getAllByRole('checkbox', { name: /Updated/i })[0]);

    expect(handleChange).toHaveBeenCalledWith({
      ...defaultFilters,
      dateField: 'updatedAt',
    });
  });
});
