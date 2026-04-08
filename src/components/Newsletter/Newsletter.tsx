import React, { useEffect, useState } from 'react';
import { Mail } from 'lucide-react';

import headphonesImg from '@/assets/images/newsletter_headphones.png';
import laptopImg from '@/assets/images/newsletter_laptop.png';
import { Button } from '@/components/Button';
import { Input } from '@/components/Input';
import { subscribeToNewsletter } from '@/services/newsletter.service';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!message && !errorMessage) return;

    const timer = setTimeout(() => {
      setMessage(null);
      setErrorMessage(null);
    }, 8000);

    return () => clearTimeout(timer);
  }, [message, errorMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const normalizedEmail = email.trim();

    setMessage(null);
    setErrorMessage(null);

    if (!normalizedEmail) {
      setErrorMessage('Email is required.');
      return;
    }

    try {
      setIsLoading(true);

      await subscribeToNewsletter(normalizedEmail);

      setMessage('You have successfully subscribed.');
      setEmail('');
    } catch (error) {
      console.error(error);

      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'Something went wrong. Try again.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="flex h-[360px] w-full items-center justify-center overflow-hidden bg-[rgb(var(--color-bg-sec))] transition-colors duration-300">
      <div className="hidden h-full flex-1 xl:block">
        <img
          src={headphonesImg}
          alt="headphones"
          className="pointer-events-none h-full w-full object-contain object-left"
        />
      </div>
      <div className="z-10 mx-auto flex w-full max-w-[540px] flex-col items-center px-8 text-center md:px-0">
        <h2 className="m-0 text-3xl font-medium tracking-tight text-[rgb(var(--color-text))] transition-colors md:text-4xl/11">
          Join Our Newsletter
        </h2>
        <p className="mt-2 text-base font-normal text-[rgb(var(--color-text))] transition-colors md:text-lg">
          Sign up for deals, new products and promotions
        </p>
        <form
          noValidate
          onSubmit={handleSubmit}
          className="mt-8 flex w-full max-w-[488px] items-center border-b border-[rgb(var(--color-text))]/20 pb-3"
        >
          <Mail
            className="h-6 w-6 shrink-0 text-[rgb(var(--color-text))]"
            strokeWidth={1.5}
          />
          <Input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-2"
            inputClassName="!border-none !bg-transparent !p-0 text-base/7 font-medium tracking-tight text-[rgb(var(--color-text))] !shadow-none !outline-none !ring-0 placeholder:!font-semibold placeholder:!text-[#6C7275] placeholder:!opacity-100"
            required
          />
          <Button
            type="submit"
            disabled={isLoading}
            className="!h-auto shrink-0 !border-none !bg-transparent !p-0 text-base/7 font-medium tracking-tight text-[#6C7275] !shadow-none transition-opacity hover:!opacity-70"
          >
            {isLoading ? 'Loading' : 'Signup'}
          </Button>
        </form>
        {message && <p className="mt-3 text-sm text-green-600">{message}</p>}

        {errorMessage && (
          <p className="mt-3 text-sm text-red-500">{errorMessage}</p>
        )}
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
