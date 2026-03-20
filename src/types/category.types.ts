export interface Category {
  id: string;
  title: string;
  imageUrl?: string | null;
  description?: string | null;
  parent?: string | null;
  depth: 1 | 2;
  createdAt: string;
  updatedAt: string;
}

export interface CategoriesPageResult {
  total: number;
  totalPages: number;
  page: number;
  limit: number;
  items: Category[];
}

export interface CreateCategoryInput {
  title: string;
  depth: 1 | 2;
  imageUrl?: string;
  description?: string;
  parent?: string | null;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput>;
