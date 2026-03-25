import { describe, expect, it } from 'vitest';

import { render, screen } from '@/utils/test-utils';

import { TableOrders } from './TableOrders';

describe('UI Component: TableOrders', () => {
  it('should render the table', () => {
    render(<TableOrders />);
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should render all column headers', () => {
    render(<TableOrders />);

    expect(
      screen.getByRole('columnheader', { name: 'Product Name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Customer name' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Order ID' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Amount' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Status' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Date' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Phone' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: 'Actions' }),
    ).toBeInTheDocument();
  });
});
