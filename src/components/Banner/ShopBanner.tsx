import { ChevronRight } from 'lucide-react';

import bannerImage from '../../assets/images/banner.png';

import styles from './ShopBanner.module.css';

export const ShopBanner = () => {
  return (
    <div className="relative flex w-full flex-col items-center justify-center overflow-hidden py-24 md:py-32">
      <img
        src={bannerImage}
        alt="Shop Banner Background"
        className={`absolute inset-0 h-full w-full object-cover object-center ${styles.bannerImage}`}
      />

      <div className="absolute inset-0 bg-white/20"></div>

      <div className="relative z-10 flex flex-col items-center px-4 text-center">
        <div className="mb-4 flex items-center space-x-1 text-sm font-medium text-gray-600">
          <a href="/" className="transition-colors hover:text-black">
            Home
          </a>
          <ChevronRight className="h-4 w-4" strokeWidth={1.5} />
          <span className="text-black">Shop</span>
        </div>

        <h1 className="mb-4 text-4xl font-medium text-black md:text-5xl lg:text-6xl">
          Shop Page
        </h1>

        <p className="max-w-md text-base text-gray-800 md:text-lg">
          Upgrade your life with the latest technology you've always wanted.
        </p>
      </div>
    </div>
  );
};
