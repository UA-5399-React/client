import type { Meta, StoryObj } from '@storybook/react-vite';

import { Input } from './Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  tags: ['autodocs'],
  argTypes: {
    state: {
      control: 'select',
      options: ['default', 'success', 'error'],
    },
    variant: {
      control: 'select',
      options: ['outlined', 'underlined'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    label: 'Product name',
    placeholder: 'Enter product name...',
    variant: 'outlined',
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Price',
    value: '-100',
    state: 'error',
    helperText: 'Price cannot be less than zero.',
  },
};

export const Password: Story = {
  args: {
    label: 'Password',
    type: 'password',
    placeholder: 'Enter password',
  },
};

export const WithIcon: Story = {
  args: {
    placeholder: 'Search...',
    leftIcon: <span className="ml-2">🔍</span>,
    variant: 'outlined',
  },
};

export const Disabled: Story = {
  args: {
    label: 'blocked field',
    placeholder: 'Input unavailable...',
    variant: 'outlined',
    disabled: true,
  },
};
