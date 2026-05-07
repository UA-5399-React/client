import { create } from 'zustand';

import { DEFAULT_FILTER } from '@/constants';
import type { ProductsFilters } from '@/types/filters';
import type { ProductSortField, SortOrder } from '@/types/productsSort';

interface AdminProductsStore {
  filters: ProductsFilters;
  search: string;
  page: number;
  sort: ProductSortField;
  order: SortOrder;
  selectedIds: string[];
  setFilters: (filters: ProductsFilters) => void;
  setSearch: (serach: string) => void;
  setPage: (page: number) => void;
  setSort: (sort: ProductSortField, order: SortOrder) => void;
  reset: () => void;
  toggleSelect: (id: string) => void;
  selectAll: (ids: string[]) => void;
  clearSelection: () => void;
}

export const useAdminProductsStore = create<AdminProductsStore>((set) => ({
  filters: DEFAULT_FILTER,
  search: '',
  page: 1,
  sort: 'updatedAt',
  order: 'desc',
  selectedIds: [],
  setFilters: (filters) => set({ filters, page: 1 }),
  setSearch: (search) =>
    set({
      search,
      page: 1,
    }),
  setPage: (page) => set({ page }),
  setSort: (sort, order) => set({ sort, order, page: 1 }),
  reset: () =>
    set({
      filters: DEFAULT_FILTER,
      search: '',
      page: 1,
      sort: 'updatedAt',
      order: 'desc',
    }),
  toggleSelect: (id) =>
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((s) => s !== id)
        : [...state.selectedIds, id],
    })),
  selectAll: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),
}));
