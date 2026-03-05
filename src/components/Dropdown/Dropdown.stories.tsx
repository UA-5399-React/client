import type { Meta, StoryObj } from '@storybook/react-vite';

import { Dropdown } from './Dropdown';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/UI/Dropdown',
  component: Dropdown,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onChange: { action: 'selected values changed' },
  },
};

export default meta;

type Story = StoryObj<typeof Dropdown>;

const commonOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
  { value: 'dragonfruit', label: 'Dragonfruit' },
  { value: 'elderberry', label: 'Elderberry' },
];

export const Default: Story = {
  args: {
    label: 'Fruits',
    options: commonOptions,
    placeholder: 'Select your favorite fruits',
  },
};

export const WithSelectedItems: Story = {
  args: {
    label: 'Pre-selected items',
    options: commonOptions,
    placeholder: 'Selected: Apple, Banana',
  },
};

export const LongList: Story = {
  args: {
    label: 'Countries',
    options: [
      { value: 'ua', label: 'Ukraine' },
      { value: 'us', label: 'United States' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'de', label: 'Germany' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'pl', label: 'Poland' },
      { value: 'es', label: 'Spain' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'pl', label: 'Poland' },
      { value: 'es', label: 'Spain' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'pl', label: 'Poland' },
      { value: 'es', label: 'Spain' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'pl', label: 'Poland' },
      { value: 'es', label: 'Spain' },
      { value: 'fr', label: 'France' },
      { value: 'it', label: 'Italy' },
      { value: 'pl', label: 'Poland' },
      { value: 'es', label: 'Spain' },
    ],
    placeholder: 'Choose countries',
  },
};

export const CustomPlaceholder: Story = {
  args: {
    label: 'Categories',
    options: [
      { value: 'tech', label: 'Technology' },
      { value: 'design', label: 'Design' },
      { value: 'marketing', label: 'Marketing' },
    ],
    placeholder: 'Nothing selected yet...',
  },
};
