// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from 'eslint-plugin-storybook';

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintConfigPrettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';

export default defineConfig([
  globalIgnores(['dist', 'node_modules', '.storybook', 'storybook-static']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'simple-import-sort': simpleImportSort,
    },
    rules: {
      'simple-import-sort/imports': [
        'error',
        {
          groups: [
            // 1. Global side-effects (but not styles)
            ['^\\u0000'],
            // 2. External packets (React, TanStack etc.)
            ['^react', '^@?\\w'],
            // 3. Internal aliases (@/...)
            ['^@/'],
            // 4. Relative imports (../, ./)
            ['^\\.\\.', '^\\.'],
            // 5. Styles imports always at the end
            ['^.+\\.?(css|scss|sass|less)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'error',

      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' },
      ],

      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/components/*/*'],
              message: 'Import components via the main file (@/components).',
            },
            {
              group: ['@/hooks/*/*'],
              message: 'Import hooks via the main file (@/hooks).',
            },
          ],
        },
      ],
    },
  },
  eslintConfigPrettier,
  ...storybook.configs['flat/recommended'],
]);
