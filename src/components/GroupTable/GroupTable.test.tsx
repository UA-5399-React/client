import { describe, expect, it } from 'vitest';

import type {
  SalesByCategoryItem,
  SalesByDayItem,
  SalesByProductItem,
} from '@/types/statistic.types';
import { render, screen } from '@/utils/test-utils';

import { GroupTable } from './GroupTable';

const productItems: SalesByProductItem[] = [
  {
    productName: 'Intelligent Steel Computer',
    unitsSold: 2,
    revenue: 1166.98,
    productCode: 'P-1001',
  },
];

const dayItems: SalesByDayItem[] = [
  {
    date: '2026-04-23T00:00:00.000Z',
    ordersCount: 3,
    unitsSold: 5,
    revenue: 500,
    averageCheck: 166.67,
  },
];

const categoryItems: SalesByCategoryItem[] = [
  {
    category: 'Computers',
    unitsSold: 12,
    revenue: 4200,
  },
];

describe('UI Component: GroupTable', () => {
  it('should render PRODUCT columns and row values', () => {
    render(
      <GroupTable
        groupBy="PRODUCT"
        items={productItems}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: 'Product Code' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Product Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Quantity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Revenue' }),
    ).toBeInTheDocument();

    expect(screen.getByText('P-1001')).toBeInTheDocument();
    expect(screen.getByText('Intelligent Steel Computer')).toBeInTheDocument();
    expect(screen.getByText('2 pcs')).toBeInTheDocument();
    expect(screen.getByText('$1166.98')).toBeInTheDocument();
  });

  it('should render DAY columns and formatted row values', () => {
    render(
      <GroupTable
        groupBy="DAY"
        items={dayItems}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: 'Quantity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Revenue' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Orders Count' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Average' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Date' }),
    ).toBeInTheDocument();

    expect(screen.getByText('5 pcs')).toBeInTheDocument();
    expect(screen.getByText('$500.00')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('$166.67')).toBeInTheDocument();
    expect(screen.getByText('04/23/26')).toBeInTheDocument();
  });

  it('should render CATEGORY columns and row values', () => {
    render(
      <GroupTable
        groupBy="CATEGORY"
        items={categoryItems}
        loading={false}
        error={null}
      />,
    );

    expect(
      screen.getByRole('columnheader', { name: 'Category' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Quantity' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Revenue' }),
    ).toBeInTheDocument();

    expect(screen.getByText('Computers')).toBeInTheDocument();
    expect(screen.getByText('12 pcs')).toBeInTheDocument();
    expect(screen.getByText('$4200.00')).toBeInTheDocument();
  });

  it('should show empty state when there are no items', () => {
    render(
      <GroupTable groupBy="PRODUCT" items={[]} loading={false} error={null} />,
    );

    expect(screen.getByText('No sales data found')).toBeInTheDocument();
  });

  it('should show loading and error states from MainTable', () => {
    const { rerender } = render(
      <GroupTable groupBy="PRODUCT" items={[]} loading error={null} />,
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();

    rerender(
      <GroupTable
        groupBy="PRODUCT"
        items={productItems}
        loading={false}
        error={new Error('Network failure')}
      />,
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Please try again later')).toBeInTheDocument();
  });
});
