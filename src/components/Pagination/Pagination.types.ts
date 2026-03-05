export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  limit: number;
  onPageChange: (page: number) => void;
  isLoading?: boolean;
}

export type PageElement = number | '...';
