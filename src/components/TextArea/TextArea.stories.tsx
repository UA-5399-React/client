import type { Meta, StoryObj } from '@storybook/react-vite';

import { TextArea } from './TextArea';

const meta = {
  title: 'Components/UI/TextArea',
  component: TextArea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    disabled: {
      control: 'boolean',
      description: 'Disables the textarea',
    },
    label: {
      control: 'text',
      description: 'Textarea label',
    },
    helperText: {
      control: 'text',
      description: 'Helper text below textarea',
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
    },
    state: {
      control: 'radio',
      options: ['default', 'success', 'error'],
    },
  },
} satisfies Meta<typeof TextArea>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    helperText: 'Tell us more details about this product',
    rows: 4,
  },
};

export const ErrorState: Story = {
  args: {
    label: 'Description',
    placeholder: 'Enter description',
    helperText: 'Description is required',
    state: 'error',
    rows: 4,
  },
};
