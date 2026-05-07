import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { useLocalStorage } from './useLocalStorage';

describe('useLocalStorage', () => {
  let store: Record<string, string>;

  beforeEach(() => {
    store = {};
    const mockStorage = {
      getItem: vi.fn((key: string) => store[key] ?? null),
      setItem: vi.fn((key: string, value: string) => {
        store[key] = value;
      }),
      removeItem: vi.fn((key: string) => {
        delete store[key];
      }),
      clear: vi.fn(() => {
        store = {};
      }),
    };
    vi.stubGlobal('localStorage', mockStorage);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns initial value when key is missing', () => {
    const { result } = renderHook(() => useLocalStorage('missing', 'fallback'));

    expect(result.current[0]).toBe('fallback');
  });

  it('parses stored JSON on mount', () => {
    store.theme = JSON.stringify({ mode: 'dark' });

    const { result } = renderHook(() =>
      useLocalStorage('theme', { mode: 'light' }),
    );

    expect(result.current[0]).toEqual({ mode: 'dark' });
  });

  it('falls back to initial value and logs when JSON.parse fails', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    store.bad = 'not-json';

    const { result } = renderHook(() => useLocalStorage('bad', 42));

    expect(result.current[0]).toBe(42);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });

  it('setValue updates state and persists to localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));

    act(() => {
      result.current[1](5);
    });

    expect(result.current[0]).toBe(5);
    expect(store.count).toBe('5');
  });

  it('setValue accepts an updater function', () => {
    const { result } = renderHook(() => useLocalStorage('n', 1));

    act(() => {
      result.current[1]((v) => v + 2);
    });

    expect(result.current[0]).toBe(3);
    expect(store.n).toBe('3');
  });

  it('logs when setItem throws after updating state', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(() => null),
      setItem: vi.fn(() => {
        throw new Error('quota');
      }),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });

    const { result } = renderHook(() => useLocalStorage('k', 0));

    act(() => {
      result.current[1](1);
    });

    expect(result.current[0]).toBe(1);
    expect(consoleSpy).toHaveBeenCalled();

    consoleSpy.mockRestore();
  });
});
