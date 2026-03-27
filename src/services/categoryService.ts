import type { Category } from '@/types';

import { apiClient } from './api';

interface PublicCategoryResponse {
  _id: string;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  parent?: string | null;
  depth: 1 | 2;
  createdAt: string;
  updatedAt: string;
}

export const mapPublicCategory = (
  category: PublicCategoryResponse,
): Category => ({
  id: category._id,
  title: category.title,
  imageUrl: category.imageUrl ?? null,
  description: category.description ?? null,
  parent: category.parent ?? null,
  depth: category.depth,
  createdAt: category.createdAt,
  updatedAt: category.updatedAt,
});

export const categoryService = {
  async getPublicCategories(): Promise<Category[]> {
    const response = await apiClient.get<PublicCategoryResponse[]>('/category');

    return response.map(mapPublicCategory);
  },
};
