import { Outlet } from 'react-router-dom';
import { Sidebar } from '../Sidebar/Sidebar';

export function AdminLayout() {
  return (
    <div className="flex h-screen min-h-screen">
      <aside className="flex h-full w-[255px] max-w-[255px] shrink-0 flex-col">
        <Sidebar />
      </aside>

      <main className="min-w-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
