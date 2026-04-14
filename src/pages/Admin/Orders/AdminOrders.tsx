import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  ExportButton,
  OrdersTopWidgets,
  OrderTabs,
  Pagination,
  TableOrders,
} from '@/components';
import { ADMIN_PAGE_LIMIT, EXPORT_TYPES, ROUTES } from '@/constants';
import { DEFAULT_ORDER_STATUS_FILTER } from '@/constants/orders';
import {
  type OrdersSortField,
  type SortOrder,
  useAdminOrders,
} from '@/hooks/useAdminOrders';
import { useAdminOrdersCounts } from '@/hooks/useAdminOrdersCounts';
import { useErrorMessage } from '@/hooks/useErrorMessage';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import type { OrderItem } from '@/types/tableOrders.types';

type DisplayOrdersSortField = OrdersSortField | null;

const DEFAULT_SORT_BY: OrdersSortField = 'createdAt';
const DEFAULT_ORDER: SortOrder = 'desc';

export function AdminOrders() {
  const navigate = useNavigate();
  const {
    searchParams,
    currentPage,
    setPage,
    updateSearchParams,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  const currentStatus =
    searchParams.get('status') || DEFAULT_ORDER_STATUS_FILTER;
  useErrorMessage();

  const sortParam = searchParams.get('sortBy');
  const orderParam = searchParams.get('order');

  const currentSort: OrdersSortField =
    sortParam === 'createdAt' ||
    sortParam === 'totalPrice' ||
    sortParam === 'orderId' ||
    sortParam === 'customerName'
      ? sortParam
      : DEFAULT_SORT_BY;

  const currentOrder: SortOrder =
    orderParam === 'asc' || orderParam === 'desc' ? orderParam : DEFAULT_ORDER;

  const hasExplicitSortInUrl =
    searchParams.has('sortBy') && searchParams.has('order');

  const displaySort: DisplayOrdersSortField = hasExplicitSortInUrl
    ? currentSort
    : null;

  const { orders, totalPages, loading, error, handleOrderStatusChange } =
    useAdminOrders(
      currentStatus,
      currentSort,
      currentOrder,
      currentPage,
      ADMIN_PAGE_LIMIT,
    );

  const { counts, loading: countsLoading } = useAdminOrdersCounts();

  const handleCreateOrder = () => {
    navigate(ROUTES.ADMIN_ORDER_CREATE);
  };

  const handleEditOrder = (order: OrderItem) => {
    navigate(ROUTES.ADMIN_ORDER_EDIT.replace(':id', order.orderId), {
      state: { order },
    });
  };

  const handleSortChange = (field: OrdersSortField) => {
    const nextOrder: SortOrder =
      currentSort === field && currentOrder === 'asc' ? 'desc' : 'asc';

    updateSearchParams((nextParams) => {
      nextParams.set('page', '1');
      nextParams.set('sortBy', field);
      nextParams.set('order', nextOrder);
    });
  };

  const handlePageChange = (page: number) => {
    setPage(page);
  };

  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  useEffect(() => {
    if (loading) return;
    normalizeOutOfRangePage(totalPages);
  }, [loading, normalizeOutOfRangePage, totalPages]);

  return (
    <div className="flex flex-col p-4 sm:p-6 lg:p-8">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold text-[#2C2C2C]">Orders</h1>
      </div>

      <OrdersTopWidgets counts={counts} loading={countsLoading} />

      <div className="flex items-center justify-start py-3">
        <Button
          variant="primary"
          onClick={handleCreateOrder}
          className="text-neutral-0 bg-blue-800"
        >
          + Create Order
        </Button>

        <ExportButton type={EXPORT_TYPES.ORDERS} />
      </div>

      <OrderTabs />

      <TableOrders
        items={orders}
        loading={loading}
        error={error}
        sort={displaySort}
        order={currentOrder}
        onSortChange={handleSortChange}
        onEdit={handleEditOrder}
        onStatusChange={handleOrderStatusChange}
      />

      <div className="rounded-b-lg border border-gray-100 pb-4 shadow-md">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
