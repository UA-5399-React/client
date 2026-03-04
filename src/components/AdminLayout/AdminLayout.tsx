import { Outlet } from 'react-router-dom';

import { useTheme } from '@/hooks/useTheme';

import { Sidebar } from '../Sidebar/Sidebar';

export function AdminLayout() {
  const { isDark } = useTheme();

  return (
    <div className="flex h-screen min-h-screen">
      <aside
        className={`flex h-full w-[255px] max-w-[255px] shrink-0 flex-col ${isDark ? 'bg-black' : ''}`}
      >
        <Sidebar />
      </aside>

      <main
        className={`text-text min-w-0 flex-1 ${isDark ? 'bg-white' : 'bg-black'}`}
      >
        <Outlet />
      </main>
    </div>
  );
}
