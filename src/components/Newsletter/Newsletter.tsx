import React from 'react';
import { Mail } from 'lucide-react';

import headphonesImg from '@/assets/images/newsletter_headphones.png';
import laptopImg from '@/assets/images/newsletter_laptop.png';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';

export const Newsletter: React.FC = () => {
  return (
    <section className="flex h-[360px] w-full items-center justify-center overflow-hidden bg-[rgb(var(--color-bg-sec))] transition-colors duration-300">
      <div className="hidden h-full flex-1 xl:block">
        <img
          src={headphonesImg}
          alt="headphones"
          className="pointer-events-none h-full w-full object-contain object-left"
        />
      </div>

      <div className="z-10 flex w-full max-w-[540px] shrink-0 flex-col items-center px-4 text-center">
        <h2 className="m-0 text-3xl font-medium tracking-tight text-[rgb(var(--color-text))] transition-colors md:text-4xl/11">
          Join Our Newsletter
        </h2>
        <p className="mt-2 text-base font-normal text-[rgb(var(--color-text))] transition-colors md:text-lg">
          Sign up for deals, new products and promotions
        </p>

        <form className="mt-8 flex w-full max-w-[488px] items-center border-b border-[rgb(var(--color-text))]/20 pb-3">
          <Mail
            className="h-6 w-6 shrink-0 text-[rgb(var(--color-text))]"
            strokeWidth={1.5}
          />
          <Input
            type="email"
            placeholder="Email address"
            className="w-full text-base/7 font-medium tracking-tight text-[rgb(var(--color-text))] placeholder:text-[rgb(var(--color-text))]/40 [&_input]:!h-auto [&_input]:!border-none [&_input]:!bg-transparent [&_input]:!py-0 [&_input]:!pl-2 [&_input]:!shadow-none [&_input]:!ring-0 [&_input]:!outline-none"
            required
          />

          <Button className="!h-auto shrink-0 !border-none !bg-transparent !p-0 text-base/7 font-medium tracking-tight text-[rgb(var(--color-text))]/60 !shadow-none transition-opacity hover:!opacity-70">
            Signup
          </Button>
        </form>
      </div>

      <div className="relative hidden h-full flex-1 xl:block">
        <img
          src={laptopImg}
          alt="laptop"
          className="pointer-events-none absolute right-0 bottom-0 h-full w-auto max-w-none object-contain object-right"
        />
      </div>
    </section>
  );
};
