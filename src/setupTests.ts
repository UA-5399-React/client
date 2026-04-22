import '@testing-library/jest-dom';

import { vi } from 'vitest';

vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return vi.fn();
    }
    return { show: vi.fn() };
  }),
}));
