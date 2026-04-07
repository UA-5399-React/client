import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { OrderDetailsItem } from '@/types/order.types';

import { OrderDetailsTable } from './OrderDetailsTable';

describe('OrderDetailsTable', () => {
  const items: OrderDetailsItem[] = [
    {
      productId: 'product-1',
      title: 'Refined Granite Mouse',
      imageUrl: 'https://example.com/mouse.jpg',
      unitPrice: 162.75,
      amount: 2,
      totalPrice: 325.5,
    },
    {
      productId: 'product-2',
      title: 'Ergonomic Rubber Salad',
      imageUrl: '',
      unitPrice: 1017.5,
      amount: 5,
      totalPrice: 5087.5,
    },
  ];

  it('should render table headers', () => {
    render(<OrderDetailsTable items={items} />);

    expect(
      screen.getByRole('columnheader', { name: /product/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /price/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /quantity/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('columnheader', { name: /sum/i }),
    ).toBeInTheDocument();
  });

  it('should render order items data', () => {
    render(<OrderDetailsTable items={items} />);

    expect(screen.getByText('Refined Granite Mouse')).toBeInTheDocument();
    expect(screen.getByText('Ergonomic Rubber Salad')).toBeInTheDocument();

    expect(screen.getByText('$162.75')).toBeInTheDocument();
    expect(screen.getByText('$1017.50')).toBeInTheDocument();

    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();

    expect(screen.getByText('$325.50')).toBeInTheDocument();
    expect(screen.getByText('$5087.50')).toBeInTheDocument();
  });

  it('should render image when imageUrl is provided', () => {
    render(<OrderDetailsTable items={items} />);

    const image = screen.getByAltText('Refined Granite Mouse');

    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', 'https://example.com/mouse.jpg');
  });

  it('should render fallback text when imageUrl is missing', () => {
    render(<OrderDetailsTable items={items} />);

    expect(screen.getByText('No image')).toBeInTheDocument();
  });

  it('should render only header row when items are empty', () => {
    render(<OrderDetailsTable items={[]} />);

    expect(
      screen.getByRole('columnheader', { name: /product/i }),
    ).toBeInTheDocument();

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(1);
  });
});
