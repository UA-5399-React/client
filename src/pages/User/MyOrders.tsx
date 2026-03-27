import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountSidebar, MOCK_ORDERS, OrderCard } from '@/components';
import { ROUTES } from '@/constants';
import { authService } from '@/services';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';

export function MyOrders() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pageError, setPageError] = useState('');

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
    <section className="min-h-screen bg-white px-4 md:px-8 lg:px-40">
      <h1 className="mt-10 mb-16 text-center text-[54px] leading-none font-semibold text-black">
        My Account
      </h1>

      <div className="mx-auto max-w-[1180px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-[220px_minmax(0,1fr)] md:items-start">
          <AccountSidebar user={user} onLogout={handleLogout} />

          <div className="-full min-w-0 px-[72px]">
            <h2 className="mb-6 text-xl font-semibold text-black">
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
              {MOCK_ORDERS.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
