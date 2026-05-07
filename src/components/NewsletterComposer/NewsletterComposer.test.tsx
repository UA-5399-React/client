import { describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen, waitFor } from '@/utils/test-utils';

import { NewsletterComposer } from './NewsletterComposer';

vi.mock('./newsletterTemplate', () => ({
  buildNewsletterTemplate: vi.fn(
    (subject: string, body: string) => `TEMPLATE:${subject}::${body}`,
  ),
}));

describe('UI Component: NewsletterComposer', () => {
  it('keeps action buttons disabled when subject/body are empty', () => {
    render(<NewsletterComposer onSend={vi.fn()} isSending={false} />);

    expect(screen.getByRole('button', { name: 'Preview' })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: 'Send newsletter' }),
    ).toBeDisabled();
  });

  it('opens preview modal when content is filled and preview is clicked', () => {
    const { container } = render(
      <NewsletterComposer onSend={vi.fn()} isSending={false} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Subject'), {
      target: { value: 'Launch update' },
    });

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLDivElement;
    editor.innerHTML = '<p>Hello subscribers</p>';
    editor.innerText = 'Hello subscribers';
    fireEvent.input(editor);

    fireEvent.click(screen.getByRole('button', { name: 'Preview' }));

    expect(screen.getByTitle('Email preview')).toBeInTheDocument();
    expect(
      screen.getByText('Launch update', { selector: 'p' }),
    ).toBeInTheDocument();
  });

  it('opens confirm modal and sends newsletter, then resets fields', async () => {
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <NewsletterComposer onSend={onSend} isSending={false} />,
    );

    fireEvent.change(screen.getByPlaceholderText('Subject'), {
      target: { value: 'May newsletter' },
    });

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLDivElement;
    editor.innerHTML = '<p>Big discounts</p>';
    editor.innerText = 'Big discounts';
    fireEvent.input(editor);

    fireEvent.click(screen.getByRole('button', { name: 'Send newsletter' }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(
      screen.getByText('Send newsletter', { selector: 'h2' }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        'Are you sure you want to send "May newsletter" to all active subscribers?',
      ),
    ).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith(
        'May newsletter',
        'TEMPLATE:May newsletter::<p>Big discounts</p>',
      );
    });

    expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
    expect(editor.innerHTML).toBe('');
  });

  it('handles insert link action from toolbar', () => {
    const promptMock = vi
      .spyOn(window, 'prompt')
      .mockReturnValue('https://example.com');
    const execCommandMock = vi.fn();
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      configurable: true,
      writable: true,
    });

    render(<NewsletterComposer onSend={vi.fn()} isSending={false} />);

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Insert link' }));

    expect(promptMock).toHaveBeenCalledWith('Enter URL:');
    expect(execCommandMock).toHaveBeenCalledWith(
      'createLink',
      false,
      'https://example.com',
    );
  });
});
