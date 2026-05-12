import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MobileSidebar, Sidebar } from '@/components';

const SIDEBAR_COLLAPSED_KEY = 'admin-sidebar-collapsed';

export function AdminLayout() {
  const [isOpen, isSetOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    const savedState = localStorage.getItem(SIDEBAR_COLLAPSED_KEY);
    return savedState !== null ? JSON.parse(savedState) : true;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_COLLAPSED_KEY, JSON.stringify(isCollapsed));
  }, [isCollapsed]);

  return (
    <div
      className={`flex min-h-screen flex-col md:flex-row md:items-stretch ${
        isOpen ? 'max-md:h-screen max-md:overflow-hidden' : ''
      }`}
    >
      <aside
        className={`scrollbar-hide sticky top-0 hidden h-screen shrink-0 flex-col overflow-y-auto bg-[rgb(var(--color-bg-sec))] transition-all duration-300 md:flex ${
          isCollapsed ? 'w-[80px]' : 'w-[255px]'
        }`}
      >
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </aside>

      <div
        className={`flex w-full bg-[rgb(var(--color-bg-sec))] md:hidden ${isOpen ? '' : 'min-w-[920px]'}`}
      >
        <MobileSidebar isSidebarOpen={isOpen} onSidebarChange={isSetOpen} />
      </div>

      <main
        className={`text-text bg-background flex-1 transition-all duration-300 ${
          isOpen
            ? 'max-md:invisible max-md:h-screen max-md:overflow-hidden'
            : ' '
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
