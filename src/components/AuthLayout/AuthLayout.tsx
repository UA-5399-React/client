import React from 'react';
import { Outlet } from 'react-router-dom';

import duckLogo from '@/assets/images/duck.svg';

export const AuthLayout: React.FC = () => {
  return (
    <div className="flex min-h-screen w-full flex-col font-sans text-gray-900 lg:flex-row">
      <div className="flex w-full flex-col items-center justify-center bg-[#f4f5f6] py-12 lg:w-1/2 lg:py-0">
        <div className="flex flex-col items-center justify-center text-center">
          <img
            src={duckLogo}
            alt="TechnoWorld STORE Logo"
            className="mb-2 h-48 w-48 object-cover object-center md:h-64 md:w-64 lg:h-128 lg:w-128"
          />
        </div>
      </div>

      <div className="flex w-full flex-1 items-center justify-center bg-white py-12 lg:w-1/2 lg:py-0">
        <Outlet />
      </div>
    </div>
  );
};
