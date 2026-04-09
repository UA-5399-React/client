import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { unsubscribeFromNewsletter } from '@/services/newsletter.service';

export function NewsletterUnsubscribePage() {
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email');

  const isEmailMissing = !email;

  const [status, setStatus] = useState<
    'idle' | 'loading' | 'success' | 'error'
  >(isEmailMissing ? 'error' : 'idle');
  const [message, setMessage] = useState<string>(
    isEmailMissing ? 'Email is missing in the unsubscribe link.' : '',
  );

  const hasRun = useRef(false);

  useEffect(() => {
    if (!email || hasRun.current) return;

    hasRun.current = true;

    const runUnsubscribe = async () => {
      try {
        setStatus('loading');
        await unsubscribeFromNewsletter(email);
        setStatus('success');
        setMessage('You have successfully unsubscribed from the newsletter.');
      } catch (error) {
        setStatus('error');
        setMessage(
          error instanceof Error
            ? error.message
            : 'Failed to unsubscribe from the newsletter.',
        );
      }
    };

    void runUnsubscribe();
  }, [email]);

  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6">
      <div className="w-full max-w-[560px] rounded-2xl border border-[rgb(var(--color-text))]/10 bg-[rgb(var(--color-bg-sec))] p-8 text-center shadow-sm">
        <h1 className="text-3xl font-medium text-[rgb(var(--color-text))]">
          Newsletter Unsubscribe
        </h1>

        {status === 'loading' && (
          <p className="mt-4 text-base text-[rgb(var(--color-text))]">
            Processing your request...
          </p>
        )}

        {status === 'success' && (
          <p className="mt-4 text-base text-green-600">{message}</p>
        )}

        {status === 'error' && (
          <p className="mt-4 text-base text-red-500">{message}</p>
        )}
      </div>
    </section>
  );
}
