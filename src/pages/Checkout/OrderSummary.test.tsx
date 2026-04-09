import { type ComponentProps } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { OrderSummary } from './OrderSummary';

type SummaryProps = ComponentProps<typeof OrderSummary>;

const mockRemoveItem = vi.fn();
const mockUpdateQuantity = vi.fn();
const mockSetPromoCode = vi.fn();

const baseItem = {
  product: {
    id: 'prod-1',
    _id: 'prod-1',
    title: 'Test Product',
    price: 100,
    imageUrl: 'https://example.com/image.jpg',
    categories: ['Furniture'],
  },
  quantity: 2,
};

const defaultProps = {
  isDark: false,
  promoCode: '',
  setPromoCode: mockSetPromoCode,
  subtotal: 200,
  total: 200,
  items: [baseItem] as unknown as SummaryProps['items'],
  removeItem: mockRemoveItem,
  updateQuantity: mockUpdateQuantity,
  carrier: 'Nova Poshta',
};

describe('Component: OrderSummary', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders standard items and layout correctly', () => {
    render(<OrderSummary {...defaultProps} />);

    expect(screen.getByText('Order summary')).toBeInTheDocument();
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('Furniture')).toBeInTheDocument();
    expect(screen.getByText('Nova Poshta | Free')).toBeInTheDocument();
  });

  it('renders correctly in dark mode', () => {
    const { container } = render(
      <OrderSummary {...defaultProps} isDark={true} />,
    );
    expect(container.firstChild).toHaveClass('bg-black');
  });

  it('handles item without image and ignores MongoDB IDs in categories', () => {
    const itemWithoutImage = {
      product: {
        ...baseItem.product,
        imageUrl: undefined,
        categories: ['507f1f77bcf86cd799439011'],
      },
      quantity: 1,
    };

    render(
      <OrderSummary
        {...defaultProps}
        items={[itemWithoutImage] as unknown as SummaryProps['items']}
      />,
    );

    expect(screen.getByText('No image')).toBeInTheDocument();
    expect(
      screen.queryByText('507f1f77bcf86cd799439011'),
    ).not.toBeInTheDocument();
  });

  it('calls updateQuantity when increase and decrease buttons are clicked', async () => {
    const user = userEvent.setup();
    render(<OrderSummary {...defaultProps} />);

    const increaseBtn = screen.getByRole('button', {
      name: /Increase quantity/i,
    });
    const decreaseBtn = screen.getByRole('button', {
      name: /Decrease quantity/i,
    });

    await user.click(increaseBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('prod-1', 3);

    await user.click(decreaseBtn);
    expect(mockUpdateQuantity).toHaveBeenCalledWith('prod-1', 1);
  });

  it('disables decrease button when quantity is 1', () => {
    const singleItem = { ...baseItem, quantity: 1 };
    render(
      <OrderSummary
        {...defaultProps}
        items={[singleItem] as unknown as SummaryProps['items']}
      />,
    );

    const decreaseBtn = screen.getByRole('button', {
      name: /Decrease quantity/i,
    });
    expect(decreaseBtn).toBeDisabled();
  });

  it('calls removeItem when delete icon is clicked', async () => {
    const user = userEvent.setup();
    render(<OrderSummary {...defaultProps} />);

    const removeBtn = screen.getByRole('button', {
      name: /Remove Test Product/i,
    });
    await user.click(removeBtn);

    expect(mockRemoveItem).toHaveBeenCalledWith('prod-1');
  });

  it('handles promo code typing and clearing via Apply button', async () => {
    const user = userEvent.setup();
    render(<OrderSummary {...defaultProps} promoCode="TEST" />);

    const input = screen.getByPlaceholderText('Promo code');
    await user.type(input, '1');

    expect(mockSetPromoCode).toHaveBeenCalled();

    const applyBtn = screen.getByRole('button', { name: 'Apply' });
    await user.click(applyBtn);

    expect(mockSetPromoCode).toHaveBeenCalledWith('');
  });

  it('uses fallbacks for missing carrier and total', () => {
    render(
      <OrderSummary
        {...defaultProps}
        carrier={undefined}
        total={0}
        subtotal={150}
      />,
    );

    expect(screen.getByText('Carrier tariffs | Free')).toBeInTheDocument();
  });
});
