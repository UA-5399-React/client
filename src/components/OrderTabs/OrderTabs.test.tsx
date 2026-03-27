import { MemoryRouter, useLocation } from 'react-router-dom';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import {
  DEFAULT_ORDER_STATUS_FILTER,
  ORDER_STATUS_OPTIONS,
} from '@/constants/orders';

import { OrderTabs } from './OrderTabs';

const LocationDisplay = () => {
  const location = useLocation();
  return <div data-testid="location-display">{location.search}</div>;
};

describe('OrderTabs', () => {
  const renderWithRouter = (initialEntries = ['/']) => {
    return render(
      <MemoryRouter initialEntries={initialEntries}>
        <OrderTabs />
        <LocationDisplay />
      </MemoryRouter>,
    );
  };

  it('renders all status options defined in constants', () => {
    renderWithRouter();

    ORDER_STATUS_OPTIONS.forEach((option) => {
      expect(
        screen.getByRole('button', { name: new RegExp(option.label, 'i') }),
      ).toBeInTheDocument();
    });
  });

  it('applies active styles to the default tab when no status is in URL', () => {
    renderWithRouter();

    const defaultTab = screen.getByRole('button', {
      name: new RegExp(DEFAULT_ORDER_STATUS_FILTER, 'i'),
    });
    expect(defaultTab).toHaveClass('bg-[#437EF7]', 'text-white');
  });

  it('highlights the correct tab based on the URL status parameter', () => {
    renderWithRouter(['/orders?status=completed']);

    const completedTab = screen.getByRole('button', { name: /completed/i });
    expect(completedTab).toHaveClass('bg-[#437EF7]');
  });

  it('updates URL and resets page to 1 when a tab is clicked', () => {
    renderWithRouter();

    const processingTab = screen.getByRole('button', { name: /processing/i });
    fireEvent.click(processingTab);

    const locationDisplay = screen.getByTestId('location-display');
    expect(locationDisplay.textContent).toContain('status=processing');
    expect(locationDisplay.textContent).toContain('page=1');
  });

  it('removes status parameter from URL when All tab is clicked', () => {
    renderWithRouter(['/orders?status=completed&page=2']);

    const allTab = screen.getByRole('button', { name: /all/i });
    fireEvent.click(allTab);

    const locationDisplay = screen.getByTestId('location-display');
    expect(locationDisplay.textContent).not.toContain('status=completed');
    expect(locationDisplay.textContent).toContain('page=1');
  });

  it('preserves other existing search parameters when changing tabs', () => {
    renderWithRouter(['/orders?search=iphone&status=new']);

    const cancelledTab = screen.getByRole('button', { name: /cancelled/i });
    fireEvent.click(cancelledTab);

    const locationDisplay = screen.getByTestId('location-display');
    expect(locationDisplay.textContent).toContain('search=iphone');
    expect(locationDisplay.textContent).toContain('status=cancelled');
  });
});
