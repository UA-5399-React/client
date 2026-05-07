import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { NewsletterPreview } from './NewsletterPreview';

describe('NewsletterPreview', () => {
  it('shows subject or fallback when subject is empty', () => {
    const { rerender } = render(
      <NewsletterPreview
        subject="Weekly deals"
        body="<p>a</p>"
        onClose={vi.fn()}
      />,
    );

    expect(screen.getByText('Weekly deals')).toBeInTheDocument();

    rerender(<NewsletterPreview subject="" body="" onClose={vi.fn()} />);

    expect(screen.getByText('No subject')).toBeInTheDocument();
  });

  it('renders iframe srcDoc from buildNewsletterTemplate output', () => {
    render(
      <NewsletterPreview subject="Subj" body="<p>b</p>" onClose={vi.fn()} />,
    );

    const iframe = screen.getByTitle('Email preview');
    const srcDoc = iframe.getAttribute('srcDoc') ?? '';

    expect(srcDoc).toContain('<h1>Subj</h1>');
    expect(srcDoc).toContain('<p>b</p>');
    expect(srcDoc).toContain('/newsletter/unsubscribe');
    expect(iframe).toHaveAttribute('sandbox', 'allow-same-origin');
  });

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn();
    const { container } = render(
      <NewsletterPreview subject="x" body="y" onClose={onClose} />,
    );

    fireEvent.click(container.firstChild as HTMLElement);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('does not close when modal content is clicked', () => {
    const onClose = vi.fn();
    render(<NewsletterPreview subject="x" body="y" onClose={onClose} />);

    fireEvent.click(screen.getByTitle('Email preview'));

    expect(onClose).not.toHaveBeenCalled();
  });

  it('calls onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<NewsletterPreview subject="x" body="y" onClose={onClose} />);

    const [closeButton] = screen.getAllByRole('button');
    fireEvent.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
