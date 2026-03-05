import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Pagination } from './Pagination';

describe('UI Component: Pagination', () => {
  it('should render correct number of pages without dots when total pages are 7 or less', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );

    const pageButtons = screen
      .getAllByRole('button')
      .filter((btn) => !btn.className.includes('pagination-arrow'));
    expect(pageButtons).toHaveLength(5);
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.queryByText('...')).not.toBeInTheDocument();
  });

  it('should render dots at the end when current page is at the beginning', () => {
    render(
      <Pagination currentPage={2} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(1);
  });

  it('should render dots at the beginning when current page is at the end', () => {
    render(
      <Pagination currentPage={9} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getAllByText('...')).toHaveLength(1);
  });

  it('should render dots on both sides when current page is in the middle', () => {
    render(
      <Pagination currentPage={5} totalPages={10} onPageChange={vi.fn()} />,
    );

    expect(screen.getAllByText('...')).toHaveLength(2);
  });

  it('should call onPageChange with correct page number when a page button is clicked', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    const page3Button = screen.getByRole('button', { name: '3' });
    await user.click(page3Button);

    expect(handlePageChange).toHaveBeenCalledWith(3);
    expect(handlePageChange).toHaveBeenCalledOnce();
  });

  it('should disable previous button on the first page', () => {
    render(
      <Pagination currentPage={1} totalPages={5} onPageChange={vi.fn()} />,
    );

    const prevButtons = screen.getAllByRole('button');
    const prevButton = prevButtons[0];

    expect(prevButton).toBeDisabled();
  });

  it('should disable next button on the last page', () => {
    render(
      <Pagination currentPage={5} totalPages={5} onPageChange={vi.fn()} />,
    );

    const buttons = screen.getAllByRole('button');
    const nextButton = buttons[buttons.length - 1];

    expect(nextButton).toBeDisabled();
  });

  it('should apply active class to the current page button', () => {
    render(
      <Pagination currentPage={3} totalPages={5} onPageChange={vi.fn()} />,
    );

    const activePageButton = screen.getByRole('button', { name: '3' });

    expect(activePageButton).toHaveClass('active');
  });

  it('should call onPageChange with correct values when arrow buttons are clicked', async () => {
    const user = userEvent.setup();
    const handlePageChange = vi.fn();

    render(
      <Pagination
        currentPage={3}
        totalPages={5}
        onPageChange={handlePageChange}
      />,
    );

    const buttons = screen.getAllByRole('button');
    const prevButton = buttons[0];
    const nextButton = buttons[buttons.length - 1];

    await user.click(prevButton);
    expect(handlePageChange).toHaveBeenCalledWith(2);

    await user.click(nextButton);
    expect(handlePageChange).toHaveBeenCalledWith(4);
  });
});
