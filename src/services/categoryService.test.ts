import { describe, expect, it, vi } from 'vitest';

import { apiClient } from './api';
import { categoryService } from './categoryService';

vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
  },
}));

describe('service: categoryService', () => {
  it('maps public category response ids to client category ids', async () => {
    vi.mocked(apiClient.get).mockResolvedValue([
      {
        _id: 'cat-1',
        title: 'Phones',
        imageUrl: null,
        description: 'Mobile devices',
        parent: null,
        depth: 1,
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
    ]);

    const categories = await categoryService.getPublicCategories();

    expect(categories).toEqual([
      {
        id: 'cat-1',
        title: 'Phones',
        imageUrl: null,
        description: 'Mobile devices',
        parent: null,
        depth: 1,
        createdAt: '2026-03-20T10:00:00.000Z',
        updatedAt: '2026-03-20T10:00:00.000Z',
      },
    ]);
  });
});
