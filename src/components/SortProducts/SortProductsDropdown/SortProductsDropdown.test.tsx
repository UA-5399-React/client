import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { SortProductsDropdown } from './SortProductsDropdown';

describe('UI Component: SortProductsDropdown', () => {
  it('should render sorting toggle button', () => {
    const onChange = vi.fn();

    render(<SortProductsDropdown value="updated-desc" onChange={onChange} />);

    expect(
      screen.getByRole('button', { name: /open sorting menu/i }),
    ).toBeInTheDocument();
  });

  it('should open dropdown on toggle button click', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="updated-desc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );

    expect(screen.getByText(/sort by/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /price/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /last updated/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /created date/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /ascending/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /descending/i }),
    ).toBeInTheDocument();
  });

  it('should call onChange with updated-desc when Last updated is selected', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="price-asc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /last updated/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('updated-desc');
  });

  it('should call onChange with title-asc when Name is selected from title-asc state', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="title-asc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /name/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('title-asc');
  });

  it('should call onChange with current sort and ascending order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="price-desc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /ascending/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('price-asc');
  });

  it('should call onChange with current sort and descending order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="created-asc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /descending/i }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('created-desc');
  });

  it('should close dropdown after selecting sort field', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="updated-desc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /price/i }));

    expect(screen.queryByText(/sort by/i)).not.toBeInTheDocument();
  });

  it('should close dropdown after selecting sort order', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<SortProductsDropdown value="title-desc" onChange={onChange} />);

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );
    await user.click(screen.getByRole('button', { name: /ascending/i }));

    expect(screen.queryByText(/sort by/i)).not.toBeInTheDocument();
  });

  it('should close dropdown when overlay is clicked', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <SortProductsDropdown value="updated-desc" onChange={onChange} />,
    );

    await user.click(
      screen.getByRole('button', { name: /open sorting menu/i }),
    );

    const overlay = container.querySelector('.fixed.inset-0');
    expect(overlay).toBeInTheDocument();

    if (!overlay) {
      throw new Error('Overlay not found');
    }

    await user.click(overlay);

    expect(screen.queryByText(/sort by/i)).not.toBeInTheDocument();
  });
});
