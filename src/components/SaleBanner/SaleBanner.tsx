import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

import bannerImage from '@/assets/images/banner_sale.png';
import { ROUTES } from '@/constants/index';

export const SaleBanner: React.FC = () => {
  return (
    <section className="flex w-full flex-col md:flex-row">
      <div className="flex flex-1">
        <img
          src={bannerImage}
          alt="Sale Banner"
          className="min-h-[300px] w-full object-cover md:min-h-[530px]"
        />
      </div>

      <div className="flex flex-1 flex-col justify-center bg-[rgb(var(--color-bg-sec))] px-4 py-14 transition-colors duration-300 md:py-24 md:pr-10 md:pl-16">
        <div className="flex w-full flex-col items-start gap-6 md:max-w-[344px]">
          <div className="flex w-full flex-col items-start gap-4">
            <span className="text-base/4 font-bold text-[#377DFF] uppercase">
              SALE UP TO 35% OFF
            </span>

            <h2 className="m-0 text-3xl/10 font-medium tracking-tight text-[rgb(var(--color-text))] transition-colors md:text-4xl/tight">
              HUNDREDS of New lower prices!
            </h2>

            <p className="m-0 text-base/7 font-normal text-[rgb(var(--color-text))] transition-colors md:text-xl/8">
              It's more affordable than ever to give every room in your home a
              stylish makeover
            </p>
          </div>

          <Link
            to={ROUTES.SHOP}
            className="group flex items-center gap-2 border-b border-[rgb(var(--color-text))] pb-1 text-base font-medium text-[rgb(var(--color-text))] transition-all hover:opacity-70"
          >
            Shop Now
            <ArrowRight
              size={20}
              className="transition-transform group-hover:translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
};
