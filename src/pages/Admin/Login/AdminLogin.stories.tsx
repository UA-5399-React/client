import { MemoryRouter } from 'react-router-dom';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AdminLogin } from './AdminLogin';

const meta: Meta<typeof AdminLogin> = {
  title: 'Pages/AdminLogin',
  component: AdminLogin,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  // MemoryRouter is required because LoginForm uses useNavigate internally
  decorators: [
    (Story) => (
      <MemoryRouter initialEntries={['/admin/login']}>
        <Story />
      </MemoryRouter>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

// Default unauthenticated view – what a visitor sees
export const Default: Story = {};

// Simulates the page when the user has no localStorage session (fresh visit)
export const FreshVisit: Story = {
  name: 'Fresh Visit (no session)',
  decorators: [
    (Story) => {
      localStorage.clear();
      return (
        <MemoryRouter initialEntries={['/admin/login']}>
          <Story />
        </MemoryRouter>
      );
    },
  ],
};
