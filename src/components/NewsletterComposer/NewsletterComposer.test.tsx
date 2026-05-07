import { fireEvent, within } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent, waitFor } from '@/utils/test-utils';

import { NewsletterComposer } from './NewsletterComposer';

vi.mock('./newsletterTemplate', () => ({
  buildNewsletterTemplate: vi.fn((subject: string, body: string) => {
    return `<html>${subject}||${body}</html>`;
  }),
}));

function fillEditorBody(editor: HTMLElement, html: string) {
  editor.innerHTML = html;
  Object.defineProperty(editor, 'innerText', {
    configurable: true,
    get() {
      return (this as HTMLElement).textContent ?? '';
    },
  });
  fireEvent.input(editor);
}

describe('NewsletterComposer', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('disables Preview and Send when subject or body is empty', () => {
    render(<NewsletterComposer onSend={vi.fn()} isSending={false} />);

    expect(screen.getByRole('button', { name: /preview/i })).toBeDisabled();
    expect(
      screen.getByRole('button', { name: /send newsletter/i }),
    ).toBeDisabled();
  });

  it('enables actions when subject and body have text', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NewsletterComposer onSend={vi.fn()} isSending={false} />,
    );

    await user.type(screen.getByPlaceholderText('Subject'), 'News');

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>Content here</p>');

    expect(screen.getByRole('button', { name: /preview/i })).not.toBeDisabled();
    expect(
      screen.getByRole('button', { name: /send newsletter/i }),
    ).not.toBeDisabled();
  });

  it('opens preview and closes when clicking backdrop', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NewsletterComposer onSend={vi.fn()} isSending={false} />,
    );

    await user.type(screen.getByPlaceholderText('Subject'), 'My subject');

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>Line</p>');

    await user.click(screen.getByRole('button', { name: /preview/i }));

    expect(screen.getByTitle('Email preview')).toBeInTheDocument();
    expect(screen.getByText('My subject')).toBeInTheDocument();

    const backdrop = screen.getByTitle('Email preview').closest('div.fixed');
    fireEvent.click(backdrop as HTMLElement);

    await waitFor(() => {
      expect(screen.queryByTitle('Email preview')).not.toBeInTheDocument();
    });
  });

  it('shows Sending label and disables send while isSending', async () => {
    const user = userEvent.setup();
    const { container } = render(
      <NewsletterComposer onSend={vi.fn()} isSending={true} />,
    );

    await user.type(screen.getByPlaceholderText('Subject'), 'S');

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>B</p>');

    expect(screen.getByRole('button', { name: /sending/i })).toBeDisabled();
  });

  it('calls onSend with built HTML after confirm; resets fields', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn().mockResolvedValue(undefined);
    const { container } = render(
      <NewsletterComposer onSend={onSend} isSending={false} />,
    );

    await user.type(screen.getByPlaceholderText('Subject'), 'Promo');

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>Details</p>');

    await user.click(screen.getByRole('button', { name: /send newsletter/i }));

    const dialog = screen.getByRole('dialog');
    expect(
      within(dialog).getByRole('heading', { name: 'Send newsletter' }),
    ).toBeInTheDocument();

    await user.click(within(dialog).getByRole('button', { name: 'Send' }));

    await waitFor(() => {
      expect(onSend).toHaveBeenCalledWith(
        'Promo',
        '<html>Promo||<p>Details</p></html>',
      );
    });

    expect(screen.getByPlaceholderText('Subject')).toHaveValue('');
    expect(editor.innerHTML).toBe('');
  });

  it('does not send when confirm is cancelled', async () => {
    const user = userEvent.setup();
    const onSend = vi.fn();
    const { container } = render(
      <NewsletterComposer onSend={onSend} isSending={false} />,
    );

    await user.type(screen.getByPlaceholderText('Subject'), 'X');

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>Y</p>');

    await user.click(screen.getByRole('button', { name: /send newsletter/i }));

    const dialog = screen.getByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel' }));

    expect(onSend).not.toHaveBeenCalled();
  });

  it('inserts link when prompt returns a URL', () => {
    vi.spyOn(window, 'prompt').mockReturnValue('https://example.com');
    const execCommandMock = vi.fn(() => true);
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      writable: true,
      configurable: true,
    });

    const { container } = render(
      <NewsletterComposer onSend={vi.fn()} isSending={false} />,
    );

    const editor = container.querySelector(
      '[contenteditable="true"]',
    ) as HTMLElement;
    fillEditorBody(editor, '<p>link me</p>');
    editor.focus();

    const insertLink = screen.getByTitle('Insert link');
    fireEvent.mouseDown(insertLink);

    expect(window.prompt).toHaveBeenCalledWith('Enter URL:');
    expect(execCommandMock).toHaveBeenCalledWith(
      'createLink',
      false,
      'https://example.com',
    );
  });
});
