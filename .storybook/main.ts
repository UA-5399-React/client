import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@chromatic-com/storybook',
    '@storybook/addon-docs',
    '@storybook/addon-themes',
  ],
  framework: '@storybook/react-vite',
  core: {
    disableTelemetry: true, // 👈 Disables telemetry
  },
};
export default config;
