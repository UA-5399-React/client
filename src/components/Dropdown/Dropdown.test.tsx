import { describe, expect, it, vi } from 'vitest';

import { render, screen, userEvent } from '@/utils/test-utils';

import { Dropdown } from './Dropdown';

const mockOptions = [
  { value: 'apple', label: 'Apple' },
  { value: 'banana', label: 'Banana' },
  { value: 'cherry', label: 'Cherry' },
];

describe('UI Component: Dropdown', () => {
  it('should render the label and placeholder correctly', () => {
    render(
      <Dropdown
        label="Fruits"
        options={mockOptions}
        onChange={vi.fn()}
        placeholder="Select a fruit"
      />,
    );

    expect(screen.getByText('Fruits')).toBeInTheDocument();
    expect(screen.getByText('Select a fruit')).toBeInTheDocument();
  });

  it('should show options when the trigger is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Dropdown label="Fruits" options={mockOptions} onChange={vi.fn()} />,
    );

    const trigger = screen.getByRole('combobox');
    await user.click(trigger);

    for (const option of mockOptions) {
      expect(screen.getByText(option.label)).toBeInTheDocument();
    }
  });

  it('should call onChange when an option is selected', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Dropdown
        label="Fruits"
        options={mockOptions}
        onChange={handleChange}
        selectedValues={[]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText(mockOptions[0].label));

    expect(handleChange).toHaveBeenCalledWith(
      [mockOptions[0]],
      expect.any(Object),
    );
  });

  it('should allow selecting multiple options', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Dropdown
        label="Fruits"
        options={mockOptions}
        onChange={handleChange}
        selectedValues={[]}
      />,
    );

    await user.click(screen.getByRole('combobox'));
    await user.click(screen.getByText('Apple'));
    await user.click(screen.getByText('Banana'));

    expect(handleChange).toHaveBeenLastCalledWith(
      [mockOptions[0], mockOptions[1]],
      expect.any(Object),
    );
  });
});
