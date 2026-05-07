import { beforeEach, describe, expect, it, vi } from 'vitest';

import { fireEvent, render, screen } from '@/utils/test-utils';

import { EditorToolbar } from './EditorToolbar';

describe('UI Component: EditorToolbar', () => {
  const execCommandMock = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    Object.defineProperty(document, 'execCommand', {
      value: execCommandMock,
      configurable: true,
      writable: true,
    });
  });

  it('renders all toolbar actions', () => {
    render(<EditorToolbar onInsertLink={vi.fn()} />);

    expect(screen.getByRole('button', { name: 'Bold' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Italic' })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Underline' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Heading 1' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Heading 2' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Bullet list' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Numbered list' }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Insert link' }),
    ).toBeInTheDocument();
  });

  it('executes formatting commands on mouse down', () => {
    render(<EditorToolbar onInsertLink={vi.fn()} />);

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Bold' }));
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Heading 1' }));
    fireEvent.mouseDown(screen.getByRole('button', { name: 'Bullet list' }));

    expect(execCommandMock).toHaveBeenCalledWith('bold', false, undefined);
    expect(execCommandMock).toHaveBeenCalledWith('formatBlock', false, 'h1');
    expect(execCommandMock).toHaveBeenCalledWith(
      'insertUnorderedList',
      false,
      undefined,
    );
  });

  it('calls onInsertLink for link action without using execCommand', () => {
    const onInsertLink = vi.fn();

    render(<EditorToolbar onInsertLink={onInsertLink} />);

    fireEvent.mouseDown(screen.getByRole('button', { name: 'Insert link' }));

    expect(onInsertLink).toHaveBeenCalledTimes(1);
    expect(execCommandMock).not.toHaveBeenCalled();
  });
});
