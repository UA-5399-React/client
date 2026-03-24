import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

type UsePaginationPageParamOptions = {
  paramName?: string;
  fallbackPage?: number;
};

export function usePaginationPageParam({
  paramName = 'page',
  fallbackPage = 1,
}: UsePaginationPageParamOptions = {}) {
  const [searchParams, setSearchParams] = useSearchParams();

  const pageParam = searchParams.get(paramName);
  const parsedPage = Number(pageParam);

  const currentPage =
    Number.isInteger(parsedPage) && parsedPage > 0 ? parsedPage : fallbackPage;

  const updateSearchParams = useCallback(
    (updater: (params: URLSearchParams) => void) => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        updater(next);
        return next;
      });
    },
    [setSearchParams],
  );

  const setPage = useCallback(
    (nextPage: number) => {
      updateSearchParams((params) => {
        params.set(paramName, String(nextPage));
      });
    },
    [paramName, updateSearchParams],
  );

  const resetPage = useCallback(() => {
    setPage(fallbackPage);
  }, [fallbackPage, setPage]);

  const normalizeInvalidPageParam = useCallback(() => {
    if (pageParam === null) return;

    const isValidPage = Number.isInteger(parsedPage) && parsedPage > 0;

    if (!isValidPage) {
      updateSearchParams((params) => {
        params.set(paramName, String(fallbackPage));
      });
    }
  }, [fallbackPage, pageParam, paramName, parsedPage, updateSearchParams]);

  const normalizeOutOfRangePage = useCallback(
    (totalPages: number) => {
      const safeTotalPages = Math.max(totalPages, fallbackPage);

      if (currentPage > safeTotalPages) {
        updateSearchParams((params) => {
          params.set(paramName, String(fallbackPage));
        });
      }
    },
    [currentPage, fallbackPage, paramName, updateSearchParams],
  );

  return {
    searchParams,
    currentPage,
    setPage,
    resetPage,
    updateSearchParams,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  };
}
