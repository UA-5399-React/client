import type { Meta, StoryObj } from '@storybook/react';
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
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'outline'],
      description: 'Внешний вид кнопки',
    },
    disabled: {
      control: 'boolean',
      description: 'Отключает кнопку',
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

// 1. Main button
export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button',
  },
};

// 2. Secondary button
export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary Button',
  },
};

// 3. Outline button
export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline Button',
  },
};

// 4. Disabled button
export const Disabled: Story = {
  args: {
    variant: 'primary',
    children: 'Not Allowed',
    disabled: true,
  },
};
