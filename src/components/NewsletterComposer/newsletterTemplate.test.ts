import { afterEach, describe, expect, it, vi } from 'vitest';

describe('buildNewsletterTemplate', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it('embeds subject as h1, body HTML, and unsubscribe link using VITE_APP_URL', async () => {
    vi.stubEnv('VITE_APP_URL', 'https://shop.example');

    const { buildNewsletterTemplate } = await import('./newsletterTemplate');

    const html = buildNewsletterTemplate('Weekly update', '<p>Hello</p>');

    expect(html).toContain('<h1>Weekly update</h1>');
    expect(html).toContain('<p>Hello</p>');
    expect(html).toContain(
      'href="https://shop.example/newsletter/unsubscribe"',
    );
    expect(html).toContain(
      'You are receiving this email because you subscribed to our newsletter.',
    );
    expect(html).toContain('<!DOCTYPE html>');
  });

  it('uses root-relative unsubscribe URL when VITE_APP_URL is empty', async () => {
    vi.stubEnv('VITE_APP_URL', '');

    const { buildNewsletterTemplate } = await import('./newsletterTemplate');

    const html = buildNewsletterTemplate('S', '<div>body</div>');

    expect(html).toContain('href="/newsletter/unsubscribe"');
    expect(html).toContain('<div>body</div>');
  });
});
