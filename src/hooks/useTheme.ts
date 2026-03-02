import { create } from "zustand";

import type { Theme } from "../constants";
import { THEME_STORAGE_KEY } from "../constants";

interface ThemeState {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

export const useTheme = create<ThemeState>((set) => ({
  theme: (localStorage.getItem(THEME_STORAGE_KEY) as Theme) || "system",
  setTheme: (theme) => {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
    set({ theme });
  },
}));
