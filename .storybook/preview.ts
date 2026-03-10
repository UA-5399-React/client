import type { Preview } from '@storybook/react-vite';
import { withThemeByClassName } from '@storybook/addon-themes';

import '../src/index.css';

const previewConfig: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
    backgrounds: { disabled: true },
  },
  decorators: [
    // This function will toggle the class on the <html> tag inside Storybook
    withThemeByClassName({
      themes: {
        light: '', // For light theme, we don't add any class (or you can add a specific class if needed)
        dark: 'dark', // For dark theme, we add the .dark class (from theme.css)
      },
      defaultTheme: 'light', // Default theme is light
    }),
  ],
};

export default previewConfig;
