import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { EditorToolbar } from './EditorToolbar';

describe('EditorToolbar', () => {
  const execCommandMock = vi.fn(() => true);

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      writable: true,
      configurable: true,
    });
  });

  it.each<[title: string, command: string, value: string | undefined]>([
    ['Bold', 'bold', undefined],
    ['Italic', 'italic', undefined],
    ['Underline', 'underline', undefined],
    ['Heading 1', 'formatBlock', 'h1'],
    ['Heading 2', 'formatBlock', 'h2'],
    ['Bullet list', 'insertUnorderedList', undefined],
    ['Numbered list', 'insertOrderedList', undefined],
  ])(
    'on mouseDown runs document.execCommand for %s',
    (title, command, value) => {
      const onInsertLink = vi.fn();
      render(<EditorToolbar onInsertLink={onInsertLink} />);

      fireEvent.mouseDown(screen.getByTitle(title));

      expect(execCommandMock).toHaveBeenCalledTimes(1);
      expect(execCommandMock).toHaveBeenCalledWith(command, false, value);
      expect(onInsertLink).not.toHaveBeenCalled();
    },
  );

  it('calls onInsertLink for Insert link without execCommand', () => {
    const onInsertLink = vi.fn();
    render(<EditorToolbar onInsertLink={onInsertLink} />);

    fireEvent.mouseDown(screen.getByTitle('Insert link'));

    expect(onInsertLink).toHaveBeenCalledTimes(1);
    expect(execCommandMock).not.toHaveBeenCalled();
  });
});
