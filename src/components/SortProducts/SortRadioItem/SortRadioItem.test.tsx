import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { SortRadioItem } from './SortRadioItem';

describe('UI Component: SortRadioItem', () => {
  it('should render label text', () => {
    const onClick = vi.fn();

    render(<SortRadioItem checked={false} label="Name" onClick={onClick} />);

    expect(screen.getByRole('button', { name: /name/i })).toBeInTheDocument();
  });

  it('should call onClick when button is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<SortRadioItem checked={false} label="Price" onClick={onClick} />);

    await user.click(screen.getByRole('button', { name: /price/i }));

    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should render selected state when checked is true', () => {
    const onClick = vi.fn();

    const { container } = render(
      <SortRadioItem checked label="Last updated" onClick={onClick} />,
    );

    expect(
      screen.getByRole('button', { name: /last updated/i }),
    ).toBeInTheDocument();

    expect(container.querySelector('.bg-blue-500')).toBeInTheDocument();
  });

  it('should render unselected state when checked is false', () => {
    const onClick = vi.fn();

    const { container } = render(
      <SortRadioItem checked={false} label="Created date" onClick={onClick} />,
    );

    expect(
      screen.getByRole('button', { name: /created date/i }),
    ).toBeInTheDocument();

    expect(container.querySelector('.bg-blue-500')).not.toBeInTheDocument();
  });
});
