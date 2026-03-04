import type { Meta, StoryObj } from '@storybook/react-vite';

import { Checkbox } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'Components/UI/Checkbox',
  component: Checkbox,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onCheckedChange: { action: 'checked changed' },
  },
};

export default meta;

type Story = StoryObj<typeof Checkbox>;

export const Default: Story = {
  args: {
    label: 'Default Checkbox',
  },
};

export const Checked: Story = {
  args: {
    label: 'Checked state',
    defaultChecked: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled state',
    disabled: true,
  },
};

export const GreenVariant: Story = {
  args: {
    label: 'Green variant',
    defaultChecked: true,
    checkboxClassName:
      'bg-white ' + 'border-green-600 aria-[checked=true]:border-green-600 ',
    checkmarkClassName: 'text-green-700',
    labelClassName: 'text-green-700 dark:text-green-400',
  },
};
