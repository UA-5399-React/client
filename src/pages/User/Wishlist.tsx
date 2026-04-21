import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { AccountSidebar, BackButton } from '@/components';
import { ROUTES } from '@/constants';
import { useAuth } from '@/hooks/useAuth';
import { usersService } from '@/services/users.service';
import type { User } from '@/types/user';

export function Wishlist() {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const user = await usersService.getMe();
      setUser(user);
    };
    void loadUser();
  }, []);

  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <section className="bg-background text-text min-h-screen px-8 lg:px-40 lg:pb-20">
      <BackButton />

      <h1 className="text-text mt-10 mb-16 text-center text-[40px] leading-none font-semibold md:text-[54px]">
        Wishlist
      </h1>

      <AccountSidebar user={user} onLogout={handleLogout} />
    </section>
  );
}
