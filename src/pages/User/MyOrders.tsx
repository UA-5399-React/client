import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  AccountSidebar,
  BackButton,
  OrderCard,
  Pagination,
} from '@/components';
import { CLIENT_PAGE_LIMIT, ROUTES } from '@/constants';
import { usePaginationPageParam } from '@/hooks/usePaginationPageParam';
import { authService } from '@/services';
import { orderService } from '@/services/orderService';
import { usersService } from '@/services/users.service';
import type { Order } from '@/types/order.types';
import type { User } from '@/types/user';
import { mapApiOrderToOrder } from '@/utils/orderMappers';

export function MyOrders() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [orders, setOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState('');

  const [totalPages, setTotalPages] = useState(1);
  const {
    currentPage,
    setPage,
    normalizeInvalidPageParam,
    normalizeOutOfRangePage,
  } = usePaginationPageParam();

  useEffect(() => {
    const loadUser = async () => {
      try {
        const currentUser = await usersService.getMe();
        setUser(currentUser);
      } catch (err) {
        setPageError(
          err instanceof Error ? err.message : 'Failed to load profile',
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadUser();
  }, []);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setOrdersLoading(true);

        const response = await orderService.getMyOrders(
          currentPage,
          CLIENT_PAGE_LIMIT,
        );

        setOrders(response.items.map(mapApiOrderToOrder));
        setTotalPages(response.totalPages);
      } catch (err) {
        setOrdersError(
          err instanceof Error ? err.message : 'Failed to load orders',
        );
      } finally {
        setOrdersLoading(false);
      }
    };

    void loadOrders();
  }, [currentPage]);
  useEffect(() => {
    normalizeInvalidPageParam();
  }, [normalizeInvalidPageParam]);

  useEffect(() => {
    if (ordersLoading) return;
    normalizeOutOfRangePage(totalPages);
  }, [ordersLoading, normalizeOutOfRangePage, totalPages]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleLogout = async () => {
    try {
      await authService.logout();

      localStorage.removeItem('token');
      localStorage.removeItem('token_expires');
      localStorage.removeItem('role');
      localStorage.removeItem('user');

      setUser(null);
      navigate(ROUTES.HOME, { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (isLoading) {
    return <div className="p-10">Loading...</div>;
  }

  if (pageError) {
    return <div className="p-10 text-red-600">{pageError}</div>;
  }

  if (!user) {
    return <div className="p-10">User not found</div>;
  }

  return (
    <section className="bg-background min-h-screen px-4 md:px-8 lg:px-40">
      <BackButton />
      <h1 className="text-text mt-10 mb-16 text-center text-[54px] leading-none font-semibold">
        My Account
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <AccountSidebar user={user} onLogout={handleLogout} />

          <div className="-full min-w-0 px-[72px]">
            <h2 className="text-text mb-6 text-xl font-semibold">
              Orders History
            </h2>
            <div className="mb-3 hidden border-b border-gray-200 pb-3 text-sm text-gray-400 md:grid md:grid-cols-[150px_180px_140px_1fr_140px]">
              <span>Number ID</span>
              <span>Dates</span>
              <span>Status</span>
              <span>Price</span>
              <span />
            </div>
            <div className="flex flex-col">
              {ordersLoading ? (
                <div className="py-6 text-sm text-gray-500">
                  Loading orders...
                </div>
              ) : ordersError ? (
                <div className="py-6 text-sm text-red-600">{ordersError}</div>
              ) : orders.length === 0 ? (
                <div className="py-6 text-sm text-gray-500">
                  You have no orders yet.
                </div>
              ) : (
                orders.map((order) => (
                  <OrderCard key={order.id} order={order} />
                ))
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-4 pb-4">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
