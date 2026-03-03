import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './Button';

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    // Center component in the Storybook canvas
    layout: 'centered',
  },
  // Add tags and argTypes for better documentation and controls
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the button',
    },
    children: {
      control: 'text',
      description: 'Button text content',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Main button
export const Primary: Story = {
  args: {
    children: 'Click me',
  },
};

// 2. Disabled button
export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    disabled: true,
  },
};
