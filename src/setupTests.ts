import '@testing-library/jest-dom';

import { vi } from 'vitest';

const mockShow = vi.fn();

vi.mock('@/store/errorStore', () => ({
  useErrorStore: vi.fn((selector) => {
    if (typeof selector === 'function') {
      return mockShow;
    }
    return { show: mockShow };
  }),
}));
