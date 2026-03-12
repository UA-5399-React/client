import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { THEME_STORAGE_KEY } from '../constants';
import { useTheme } from './useTheme';

// Helper function for mocking system theme preferences (OS level)
const mockMatchMedia = (matchesDark: boolean) => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation((query) => ({
      // Return true only if the query matches dark mode and we passed matchesDark = true
      matches: query === '(prefers-color-scheme: dark)' ? matchesDark : false,
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    })),
  });
};

describe('Store: useTheme', () => {
  beforeEach(() => {
    // Clear the storage before each test
    localStorage.clear();
    // By default, mock the system theme as light
    mockMatchMedia(false);
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  // 1. Testing manual switch to dark theme
  it('should set theme to "dark" and update isDark to true', () => {
    const { result } = renderHook(() => useTheme());

    // act() needed because setTheme changes Zustand state
    act(() => {
      result.current.setTheme('dark');
    });

    expect(result.current.theme).toBe('dark');
    expect(result.current.isDark).toBe(true);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('dark');
  });

  // 2. Testing manual switch to light theme
  it('should set theme to "light" and update isDark to false', () => {
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('light');
    });

    expect(result.current.theme).toBe('light');
    expect(result.current.isDark).toBe(false);
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('light');
  });

  // 3. Testing behavior of "system" theme when user's OS preference is light
  it('should resolve "system" theme as light when OS preference is light', () => {
    // Tell the browser that the system theme is light
    mockMatchMedia(false);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    expect(result.current.isDark).toBe(false); // Should resolve to false
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });

  // 4. Testing behavior of "system", when user's OS preference is dark
  it('should resolve "system" theme as dark when OS preference is dark', () => {
    // Tell the browser that the system theme is dark!
    mockMatchMedia(true);
    const { result } = renderHook(() => useTheme());

    act(() => {
      result.current.setTheme('system');
    });

    expect(result.current.theme).toBe('system');
    expect(result.current.isDark).toBe(true); // Should resolve to true
    expect(localStorage.getItem(THEME_STORAGE_KEY)).toBe('system');
  });
});
