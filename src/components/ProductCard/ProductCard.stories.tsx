import type { Meta, StoryObj } from '@storybook/react-vite';

import { ProductCard } from './ProductCard';

const meta: Meta<typeof ProductCard> = {
  title: 'Components/UI/ProductCard',
  component: ProductCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;

type Story = StoryObj<typeof ProductCard>;

const mockProduct = {
  id: '1',
  title: 'Wireless Headphones',
  price: 99.99,
  imageUrl:
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  description: 'Premium wireless headphones with noise cancellation',
  status: 'active' as const,
  tags: ['electronics', 'audio'],
};

export const Default: Story = {
  args: {
    product: mockProduct,
  },
};

export const LongTitle: Story = {
  args: {
    product: {
      ...mockProduct,
      id: '2',
      title: 'Premium Noise Cancelling Wireless Bluetooth Headphones',
    },
  },
};

export const HighPrice: Story = {
  args: {
    product: {
      ...mockProduct,
      id: '3',
      title: 'Professional Camera',
      price: 2999.99,
      imageUrl:
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400',
    },
  },
};

export const LowPrice: Story = {
  args: {
    product: {
      ...mockProduct,
      id: '4',
      title: 'USB Cable',
      price: 4.99,
      imageUrl:
        'https://images.unsplash.com/photo-1588345921523-c2dcdb7f1dcd?w=400',
    },
  },
};

export const NoDescription: Story = {
  args: {
    product: {
      ...mockProduct,
      id: '5',
      description: undefined,
    },
  },
};
