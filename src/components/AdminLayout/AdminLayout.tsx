import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { MobileSidebar } from '../MobileSidebar/MobileSidebar';
import { Sidebar } from '../Sidebar/Sidebar';

export function AdminLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex h-screen min-h-screen flex-col md:flex-row">
      <aside className="hidden h-full w-[255px] max-w-[255px] shrink-0 flex-col bg-[rgb(var(--color-bg-sec))] md:flex">
        <Sidebar />
      </aside>

      <div className="flex w-full min-w-[680px] bg-[rgb(var(--color-bg-sec))] md:hidden">
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onOpenChange={setMobileMenuOpen}
        />
      </div>

      <main
        className={`text-text bg-background min-w-[680px] flex-1 ${
          mobileMenuOpen ? 'max-md:invisible' : ''
        }`}
      >
        <Outlet />
      </main>
    </div>
  );
}
