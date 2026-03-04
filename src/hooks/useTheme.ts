import { create } from 'zustand';

import type { Theme } from '../constants';
import { THEME_STORAGE_KEY } from '../constants';

interface ThemeState {
  theme: Theme;
  isDark: boolean;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || 'system',
  isDark:
    (localStorage.getItem(THEME_STORAGE_KEY) as Theme) === 'dark' ||
    ((localStorage.getItem(THEME_STORAGE_KEY) as Theme) === 'system' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches),
  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    const isDark =
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches);
    set({ theme, isDark });
  },
}));
