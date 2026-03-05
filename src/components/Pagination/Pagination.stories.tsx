import type { Meta, StoryObj } from '@storybook/react-vite';

import { Pagination } from './Pagination';

const meta = {
  title: 'Components/UI/Pagination',
  component: Pagination,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    currentPage: {
      control: 'number',
      description: 'The current active page number',
    },
    totalPages: {
      control: 'number',
      description: 'The total number of available pages',
    },
  },
  args: {
    onPageChange: (page: number) => console.log('Page changed to:', page),
  },
} satisfies Meta<typeof Pagination>;

export default meta;
type Story = StoryObj<typeof meta>;

export const FewPages: Story = {
  args: {
    currentPage: 1,
    totalPages: 5,
  },
};

export const ManyPagesStart: Story = {
  args: {
    currentPage: 1,
    totalPages: 10,
  },
};

export const ManyPagesMiddle: Story = {
  args: {
    currentPage: 5,
    totalPages: 10,
  },
};

export const ManyPagesEnd: Story = {
  args: {
    currentPage: 10,
    totalPages: 10,
  },
};
