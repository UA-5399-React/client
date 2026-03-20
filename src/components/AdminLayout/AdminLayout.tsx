import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MobileSidebar, Sidebar } from '@/components';

export function AdminLayout() {
  const [isOpen, isSetOpen] = useState(false);

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row md:items-stretch ${
        isOpen ? 'max-md:h-screen max-md:overflow-hidden' : ''
      }`}
    >
      <aside className="scrollbar-hide sticky top-0 hidden h-screen w-[255px] max-w-[255px] shrink-0 flex-col overflow-y-auto bg-[rgb(var(--color-bg-sec))] md:flex">
        <Sidebar />
      </aside>

      <div
        className={`flex w-full bg-[rgb(var(--color-bg-sec))] md:hidden ${isOpen ? '' : 'min-w-[730px]'}`}
      >
        <MobileSidebar isSidebarOpen={isOpen} onSidebarChange={isSetOpen} />
      </div>

      <main
        className={`text-text bg-background flex-1 ${
          isOpen
            ? 'max-md:invisible max-md:h-screen max-md:overflow-hidden'
            : 'min-w-[730px]'
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
