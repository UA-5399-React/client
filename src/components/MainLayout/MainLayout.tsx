import { Outlet } from 'react-router-dom';
import { Header } from '../Header/Header';

export const MainLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container mx-auto">
        <Outlet />
      </main>
    </div>
  );
};
