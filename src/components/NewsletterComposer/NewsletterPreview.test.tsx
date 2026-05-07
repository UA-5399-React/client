import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@/utils/test-utils';

import { NewsletterPreview } from './NewsletterPreview';

vi.mock('./newsletterTemplate', () => ({
  buildNewsletterTemplate: vi.fn(
    (subject: string, body: string) =>
      `<html><h1>${subject}</h1>${body}</html>`,
  ),
}));

describe('UI Component: NewsletterPreview', () => {
  it('renders subject and iframe preview content', () => {
    render(
      <NewsletterPreview
        subject="Weekly digest"
        body="<p>Top products</p>"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Preview')).toBeInTheDocument();
    expect(screen.getByText('Weekly digest')).toBeInTheDocument();
    expect(screen.getByTitle('Email preview')).toHaveAttribute(
      'srcdoc',
      '<html><h1>Weekly digest</h1><p>Top products</p></html>',
    );
  });

  it('renders fallback title when subject is empty', () => {
    render(<NewsletterPreview subject="" body="<p>x</p>" onClose={vi.fn()} />);

    expect(screen.getByText('No subject')).toBeInTheDocument();
  });

  it('calls onClose when overlay or close button is clicked', () => {
    const onClose = vi.fn();

    const { container } = render(
      <NewsletterPreview
        subject="Subject"
        body="<p>Body</p>"
        onClose={onClose}
      />,
    );

    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();
    fireEvent.click(overlay!);
    fireEvent.click(screen.getByRole('button'));

    expect(onClose).toHaveBeenCalledTimes(2);
  });
});
